#!/usr/bin/env bash
# Caddy sur out/ avec le Caddyfile de production : la redirection de langue, et rien d'autre qui bouge.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -d out ] || { echo "yarn build d'abord" >&2; exit 1; }

id=$(docker run -d --rm -p 127.0.0.1:4322:80 -v "$PWD/out:/srv:ro" -v "$PWD/Caddyfile:/etc/caddy/Caddyfile:ro" caddy:2-alpine)
trap 'docker stop "$id" >/dev/null' EXIT
for _ in $(seq 1 50); do curl -s -o /dev/null http://127.0.0.1:4322/ && break; sleep 0.2; done

B=http://127.0.0.1:4322
echec=0
attendu() {
  local code=$1 nom=$2; shift 2
  local obtenu; obtenu=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$@")
  if [[ "$obtenu" == "$code"* ]]; then echo "ok  $nom"; else echo "KO  $nom : attendu « $code », obtenu « $obtenu »"; echec=1; fi
}
attendu 200 "sans en-tête : le français" "$B/"
attendu "302 $B/en/" "en-US : vers /en/" -H 'Accept-Language: en-US,en;q=0.9,fr;q=0.8' "$B/"
attendu 200 "en-US avec cookie lang=fr : le français" -H 'Accept-Language: en-US' -H 'Cookie: lang=fr' "$B/"
attendu "302 $B/en/" "fr-FR avec cookie lang=en : vers /en/" -H 'Accept-Language: fr-FR' -H 'Cookie: lang=en' "$B/"
attendu 200 "fr-FR,en : le français" -H 'Accept-Language: fr-FR,fr;q=0.9,en;q=0.8' "$B/"
attendu 200 "lien profond en-US : pas de redirection" -H 'Accept-Language: en-US' "$B/ce-que-je-fais/"
attendu 200 "/en/ servi" "$B/en/"
attendu 404 "adresse inconnue" "$B/nulle-part/"
vary=$(curl -s -D - -o /dev/null "$B/" | grep -i '^vary:' || true)
[[ "$vary" == *Accept-Language* ]] && echo "ok  Vary sur /" || { echo "KO  Vary sur / : « $vary »"; echec=1; }
exit $echec
