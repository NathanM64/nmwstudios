# Le site sort en HTML au build : l'image de production ne contient pas Node, seulement
# Caddy et les fichiers. Rien à mettre à jour côté exécution, rien à exploiter.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/out /srv
EXPOSE 80
