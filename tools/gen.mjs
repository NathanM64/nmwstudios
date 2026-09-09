#!/usr/bin/env node
// Génération des visuels du site, via Vertex AI (facturé sur le crédit Google Cloud).
// Authentification par jeton gcloud, aucune clé API à stocker.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { join, extname } from "node:path";

const KEYS = join(homedir(), ".config/nmw/keys.env");

function die(msg) {
  console.error("Erreur : " + msg);
  process.exit(1);
}

function loadKeys() {
  if (!existsSync(KEYS)) return;
  for (const line of readFileSync(KEYS, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const sh = (cmd) => {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (e) {
    die(`${cmd}\n${e.stderr || e.message}`);
  }
};

const token = () => sh("gcloud auth print-access-token");
const project = () => process.env.VERTEX_PROJECT || sh("gcloud config get-value project");

function endpoint(model, location, method = "generateContent") {
  const host = location === "global" ? "aiplatform.googleapis.com" : `${location}-aiplatform.googleapis.com`;
  return `https://${host}/v1/projects/${project()}/locations/${location}/publishers/google/models/${model}:${method}`;
}

function parseArgs(argv) {
  const out = { _: [], ref: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-p" || a === "--prompt") out.prompt = argv[++i];
    else if (a === "-o" || a === "--out") out.out = argv[++i];
    else if (a === "-m" || a === "--model") out.model = argv[++i];
    else if (a === "-r" || a === "--ref") out.ref.push(argv[++i]);
    else if (a === "--start") out.start = argv[++i];
    else if (a === "--end") out.end = argv[++i];
    else if (a === "--aspect") out.aspect = argv[++i];
    else if (a === "--location") out.location = argv[++i];
    else if (a === "--duration") out.duration = Number(argv[++i]);
    else if (a === "--resolution") out.resolution = argv[++i];
    else if (a === "--size") out.size = argv[++i];
    else out._.push(a);
  }
  out.location ||= process.env.VERTEX_LOCATION || "global";
  return out;
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const mimeOf = (p) => MIME[extname(p).toLowerCase()] || die(`format non géré : ${p}`);
const b64 = (p) => (existsSync(p) ? readFileSync(p).toString("base64") : die(`fichier introuvable : ${p}`));

// Le quota image est de 2 requêtes par minute et par modèle : on attend au lieu d'abandonner.
async function call(url, body, tries = 5) {
  for (let i = 1; ; i++) {
    const r = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok) return j;
    if (r.status !== 429 || i >= tries) {
      die(`${r.status} sur ${url}\n${JSON.stringify(j, null, 2).slice(0, 1200)}`);
    }
    process.stdout.write(`quota atteint, nouvelle tentative dans 35 s (${i}/${tries - 1})\n`);
    await new Promise((s) => setTimeout(s, 35000));
  }
}

// Appel texte de diagnostic, coût négligeable.
async function genText(a) {
  const model = a.model || "gemini-2.5-flash";
  const j = await call(endpoint(model, a.location), {
    contents: [{ role: "user", parts: [{ text: a.prompt || "dis bonjour en un mot" }] }],
  });
  console.log((j.candidates?.[0]?.content?.parts || []).map((p) => p.text).join("").trim() || JSON.stringify(j).slice(0, 400));
}

async function genImage(a) {
  if (!a.prompt) die("prompt manquant (-p)");
  if (!a.out) die("sortie manquante (-o)");
  const model = a.model || process.env.VERTEX_IMAGE_MODEL || "gemini-3-pro-image-preview";

  const parts = [{ text: a.prompt }];
  for (const p of a.ref) parts.push({ inlineData: { mimeType: mimeOf(p), data: b64(p) } });

  const j = await call(endpoint(model, a.location), {
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      ...(a.aspect || a.size
        ? {
            imageConfig: {
              ...(a.aspect ? { aspectRatio: a.aspect } : {}),
              ...(a.size ? { imageSize: a.size } : {}),
            },
          }
        : {}),
    },
  });

  const part = (j.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData);
  if (!part) die("aucune image renvoyée :\n" + JSON.stringify(j, null, 2).slice(0, 800));
  writeFileSync(a.out, Buffer.from(part.inlineData.data, "base64"));
  console.log(`Image écrite : ${a.out}`);
}


// Veo passe par predictLongRunning puis un poll sur fetchPredictOperation.
async function genVideo(a) {
  if (!a.prompt) die("prompt manquant (-p)");
  if (!a.out) die("sortie manquante (-o)");
  const model = a.model || process.env.VERTEX_VIDEO_MODEL || "veo-3.1-generate-preview";
  const loc = a.location === "global" ? "us-central1" : a.location;
  const base = `https://${loc}-aiplatform.googleapis.com/v1/projects/${project()}/locations/${loc}/publishers/google/models/${model}`;

  const inst = { prompt: a.prompt };
  if (a.start) inst.image = { bytesBase64Encoded: b64(a.start), mimeType: mimeOf(a.start) };
  if (a.end) inst.lastFrame = { bytesBase64Encoded: b64(a.end), mimeType: mimeOf(a.end) };

  const params = {
    aspectRatio: a.aspect || "16:9",
    durationSeconds: a.duration || 8,
    resolution: a.resolution || "1080p",
    generateAudio: false,
    sampleCount: 1,
  };

  const hdr = () => ({ authorization: `Bearer ${token()}`, "content-type": "application/json" });
  let r = await fetch(`${base}:predictLongRunning`, {
    method: "POST", headers: hdr(),
    body: JSON.stringify({ instances: [inst], parameters: params }),
  });
  let j = await r.json().catch(() => ({}));
  if (!r.ok) die(`${r.status} sur ${base}:predictLongRunning\n${JSON.stringify(j, null, 2).slice(0, 1200)}`);
  const opName = j.name;
  if (!opName) die("pas de nom d'opération :\n" + JSON.stringify(j).slice(0, 600));

  process.stdout.write("Rendu lancé, attente");
  for (let i = 0; i < 120; i++) {
    await new Promise((s) => setTimeout(s, 10000));
    const pr = await fetch(`${base}:fetchPredictOperation`, {
      method: "POST", headers: hdr(), body: JSON.stringify({ operationName: opName }),
    });
    const pj = await pr.json().catch(() => ({}));
    if (pj.error) die("\n" + JSON.stringify(pj.error, null, 2).slice(0, 1200));
    if (pj.done) {
      console.log();
      const vids = pj.response?.videos || pj.response?.generatedSamples || [];
      const v = vids[0];
      const b = v?.bytesBase64Encoded || v?.video?.bytesBase64Encoded;
      const uri = v?.gcsUri || v?.video?.uri;
      if (b) {
        writeFileSync(a.out, Buffer.from(b, "base64"));
      } else if (uri) {
        const dl = await fetch(uri, { headers: { authorization: `Bearer ${token()}` } });
        writeFileSync(a.out, Buffer.from(await dl.arrayBuffer()));
      } else {
        die("pas de vidéo dans la réponse :\n" + JSON.stringify(pj).slice(0, 1000));
      }
      const ko = readFileSync(a.out).length / 1e6;
      console.log(`Vidéo écrite : ${a.out} (${ko.toFixed(1)} Mo)`);
      return;
    }
    process.stdout.write(".");
  }
  die("\ndélai dépassé, opération : " + opName);
}


// Veo n'existe pas sur Vertex pour ce projet : la vidéo passe par l'API Gemini d'AI Studio.
async function genVideoStudio(a) {
  const key = process.env.GEMINI_API_KEY || die("GEMINI_API_KEY manquante dans ~/.config/nmw/keys.env");
  if (!a.prompt) die("prompt manquant (-p)");
  if (!a.out) die("sortie manquante (-o)");
  const model = a.model || process.env.STUDIO_VIDEO_MODEL || "veo-3.1-fast-generate-preview";
  const G = "https://generativelanguage.googleapis.com/v1beta";
  const hdr = { "content-type": "application/json", "x-goog-api-key": key };

  const inst = { prompt: a.prompt };
  if (a.start) inst.image = { bytesBase64Encoded: b64(a.start), mimeType: mimeOf(a.start) };
  if (a.end) inst.lastFrame = { bytesBase64Encoded: b64(a.end), mimeType: mimeOf(a.end) };

  // Tarif au 08/09/2026, en dollars par seconde de vidéo produite.
  const TARIF = { "veo-3.1-generate-preview": 0.4, "veo-3.1-fast-generate-preview": 0.15, "veo-3.1-lite-generate-preview": 0.1 };
  const secondes = a.duration || 8;
  const prix = (TARIF[model] ?? 0.4) * secondes;
  console.log(`Modèle : ${model}`);
  console.log(`Durée : ${secondes} s  ->  coût estimé : ${prix.toFixed(2)} $`);

  const r = await fetch(`${G}/models/${model}:predictLongRunning`, {
    method: "POST", headers: hdr,
    body: JSON.stringify({
      instances: [inst],
      parameters: {
        aspectRatio: a.aspect || "16:9",
        durationSeconds: a.duration || 8,
        resolution: a.resolution || "1080p",
        sampleCount: 1,
      },
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) die(`${r.status} sur ${model}:predictLongRunning\n${JSON.stringify(j, null, 2).slice(0, 1200)}`);
  const opName = j.name || die("pas de nom d'opération :\n" + JSON.stringify(j).slice(0, 600));

  // Trace sur disque dès la soumission : un rendu ne doit pas dépendre de la survie du terminal.
  const journal = join(homedir(), ".config/nmw/rendus.log");
  try {
    writeFileSync(journal, `${new Date().toISOString()}\t${opName}\t${a.out}\n`, { flag: "a" });
  } catch {}
  console.log(`Rendu lancé : ${opName}`);
  console.log(`Reprise possible : node tools/gen.mjs resume ${opName} -o ${a.out}`);
  process.stdout.write("attente");
  let oops = 0;
  for (let i = 0; i < 120; i++) {
    await new Promise((s) => setTimeout(s, 10000));
    const pj = await (await fetch(`${G}/${opName}`, { headers: hdr })).json().catch(() => ({}));
    if (pj.error) {
      // erreurs transitoires pendant le rendu : on persévère
      if (++oops < 6) { process.stdout.write("!"); continue; }
      die("\n" + JSON.stringify(pj.error, null, 2).slice(0, 1200));
    }
    oops = 0;
    if (pj.done) {
      console.log();
      const v = (pj.response?.generateVideoResponse?.generatedSamples || pj.response?.videos || [])[0];
      const uri = v?.video?.uri || v?.uri;
      const bytes = v?.video?.bytesBase64Encoded || v?.bytesBase64Encoded;
      if (bytes) {
        writeFileSync(a.out, Buffer.from(bytes, "base64"));
      } else if (uri) {
        const dl = await fetch(uri, { headers: { "x-goog-api-key": key } });
        if (!dl.ok) die(`téléchargement ${dl.status} sur ${uri}`);
        writeFileSync(a.out, Buffer.from(await dl.arrayBuffer()));
      } else {
        die("pas de vidéo dans la réponse :\n" + JSON.stringify(pj).slice(0, 1000));
      }
      console.log(`Vidéo écrite : ${a.out} (${(readFileSync(a.out).length / 1e6).toFixed(1)} Mo)`);
      return;
    }
    process.stdout.write(".");
  }
  die("\ndélai dépassé, opération : " + opName);
}


// Reprend un rendu déjà soumis, à partir de son nom d'opération.
async function resumeVideo(a) {
  const key = process.env.GEMINI_API_KEY || die("GEMINI_API_KEY manquante");
  const opName = a._[1] || die("nom d'opération manquant");
  if (!a.out) die("sortie manquante (-o)");
  const G = "https://generativelanguage.googleapis.com/v1beta";
  const hdr = { "x-goog-api-key": key };
  process.stdout.write("attente");
  for (let i = 0; i < 180; i++) {
    const j = await (await fetch(`${G}/${opName}`, { headers: hdr })).json().catch(() => ({}));
    if (j.error) die("\n" + JSON.stringify(j.error, null, 2).slice(0, 800));
    if (j.done) {
      console.log();
      const v = (j.response?.generateVideoResponse?.generatedSamples || j.response?.videos || [])[0];
      const uri = v?.video?.uri || v?.uri;
      const bytes = v?.video?.bytesBase64Encoded || v?.bytesBase64Encoded;
      if (bytes) writeFileSync(a.out, Buffer.from(bytes, "base64"));
      else if (uri) {
        const dl = await fetch(uri, { headers: hdr });
        if (!dl.ok) die(`téléchargement ${dl.status}`);
        writeFileSync(a.out, Buffer.from(await dl.arrayBuffer()));
      } else die("pas de vidéo dans la réponse");
      console.log(`Vidéo écrite : ${a.out} (${(readFileSync(a.out).length / 1e6).toFixed(1)} Mo)`);
      return;
    }
    process.stdout.write(".");
    await new Promise((s) => setTimeout(s, 10000));
  }
  die("\ntoujours en cours");
}

loadKeys();
const a = parseArgs(process.argv.slice(2));
switch (a._[0]) {
  case "text": await genText(a); break;
  case "image": await genImage(a); break;
  case "video": await (process.env.GEMINI_API_KEY ? genVideoStudio(a) : genVideo(a)); break;
  case "video-vertex": await genVideo(a); break;
  case "resume": await resumeVideo(a); break;
  default:
    console.log(`Usage (Vertex AI, projet ${project()}) :
  node tools/gen.mjs text [-p "prompt"] [-m gemini-2.5-flash]
  node tools/gen.mjs image -p "prompt" -r reference.jpeg -o sortie.png [-m modele] [--aspect 16:9] [--location global]
  node tools/gen.mjs video -p "prompt" --start A.png --end B.png -o sequence.mp4 [--duration 8] [--resolution 1080p]`);
}
