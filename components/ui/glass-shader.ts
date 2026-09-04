// Le shader vit à part : GlassWall porte le DOM et la boucle, ce fichier porte la matière.
export const MAX_SLABS = 8

export const SETTINGS = {
  thickness: 1,
  amplitude: 15,
  bevel: 19,
  specular: 0.74,
  blur: 0.29,
  veil: 0.05,
  shadow: 0,
} as const

export const UNIFORM_NAMES = [
  'uTex',
  'uRes',
  'uTexAspect',
  'uShift',
  'uSlabs',
  'uRadii',
  'uCount',
  'uAmp',
  'uBevel',
  'uSpec',
  'uBlur',
  'uVeil',
  'uThick',
  'uShadow',
  'uLight',
  'uSweep',
  'uSweepGain',
] as const

export type UniformName = (typeof UNIFORM_NAMES)[number]

export const VERTEX_SOURCE = `
attribute vec2 a;
varying vec2 uv;
void main(){ uv = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }
`

export const FRAGMENT_SOURCE = `
precision highp float;
varying vec2 uv;
uniform sampler2D uTex;
uniform vec2  uRes;
uniform vec2  uTexAspect;
uniform vec2  uShift;
uniform vec4  uSlabs[${MAX_SLABS}];
uniform float uRadii[${MAX_SLABS}];
uniform int   uCount;
uniform float uAmp, uBevel, uSpec, uBlur, uVeil, uThick, uShadow;
uniform vec2  uLight;
uniform float uSweep, uSweepGain;

float sdBox(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - r;
}

// Un seul champ pour toutes les dalles, au lieu d'une carte par surface.
float scene(vec2 p){
  float d = 1e9;
  for(int i = 0; i < ${MAX_SLABS}; i++){
    if(i >= uCount) break;
    vec4 s = uSlabs[i];
    d = min(d, sdBox(p - (s.xy + s.zw * 0.5), s.zw * 0.5, uRadii[i]));
  }
  return d;
}

vec3 sampleBg(vec2 px){
  vec2 t = px / uRes;
  t = (t - 0.5) * uTexAspect + 0.5 + uShift;
  return texture2D(uTex, clamp(t, 0.001, 0.999)).rgb;
}

vec3 blurBg(vec2 px, float r){
  if(r < 0.6) return sampleBg(px);
  vec3 a = sampleBg(px) * 0.24;
  a += sampleBg(px + vec2(r, 0.0)) * 0.13;
  a += sampleBg(px - vec2(r, 0.0)) * 0.13;
  a += sampleBg(px + vec2(0.0, r)) * 0.13;
  a += sampleBg(px - vec2(0.0, r)) * 0.13;
  a += sampleBg(px + vec2(r, r) * 0.7) * 0.06;
  a += sampleBg(px + vec2(-r, r) * 0.7) * 0.06;
  a += sampleBg(px + vec2(r, -r) * 0.7) * 0.06;
  a += sampleBg(px + vec2(-r, -r) * 0.7) * 0.06;
  return a;
}

void main(){
  vec2 px = uv * uRes;
  px.y = uRes.y - px.y;

  // Activation : 1 derrière le balayage, 0 devant. Le verre prend au passage de la lumière.
  float act = smoothstep(uSweep + 0.10, uSweep - 0.10, px.x / uRes.x);

  vec3 base = sampleBg(px);
  // Avant le passage, le mur est plat. La matière se révèle sur le passage, pas avant.
  base = mix(mix(vec3(0.72), base, 0.30), base, act);
  base += exp(-pow((px.x / uRes.x - uSweep) * 7.0, 2.0)) * 0.16 * uSweepGain;

  float d = scene(px);
  if(uShadow > 0.01){
    float dsh = scene(px - vec2(-uShadow * 0.22, uShadow * 0.45));
    base *= 1.0 - (1.0 - smoothstep(0.0, uShadow, dsh)) * 0.30;
  }
  if(d > 1.5){ gl_FragColor = vec4(base, 1.0); return; }

  float e = 1.0;
  vec2 n = normalize(vec2(
    scene(px + vec2(e, 0.0)) - scene(px - vec2(e, 0.0)),
    scene(px + vec2(0.0, e)) - scene(px - vec2(0.0, e))
  ) + 1e-6);

  float edge = clamp(1.0 + d / uBevel, 0.0, 1.0);
  float fall = pow(edge, 2.1);
  // Le verre épais dévie deux fois, à l'entrée et à la sortie. Le second lobe est ce qui
  // fait lire une paroi de matière plutôt qu'une bordure peinte.
  float lobe2 = pow(clamp(1.0 + d / (uBevel * 2.3), 0.0, 1.0), 3.6);

  float amp = uAmp * act;
  vec2 off = n * (fall + lobe2 * uThick * 0.55) * amp;

  vec3 col = blurBg(px + off, uBlur);
  col *= 1.0 - uThick * 0.055 * (1.0 - edge * 0.5);
  col = mix(col, vec3(1.0), uVeil);

  float band = smoothstep(0.42, 0.86, edge) * (1.0 - smoothstep(0.88, 1.0, edge));
  col += band * uThick * 0.16;

  float spec = uSpec * act;
  col += pow(max(dot(n, uLight), 0.0), 3.0) * pow(edge, 3.4) * spec;
  col += smoothstep(1.6, 0.0, abs(d)) * 0.5 * spec;
  col -= pow(max(dot(n, -uLight), 0.0), 2.4) * pow(edge, 4.0) * (0.10 + uThick * 0.14);

  // Un pixel de couverture, sinon les grands rayons se crénellent.
  gl_FragColor = vec4(clamp(mix(base, col, smoothstep(1.0, -1.0, d)), 0.0, 1.0), 1.0);
}
`
