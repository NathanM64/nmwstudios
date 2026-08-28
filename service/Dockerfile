# Aucune dépendance npm : l'étape d'installation ne sert qu'à TypeScript, et l'image finale
# ne contient que du JavaScript compilé sur un Node nu.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
# Pas de root : le service ne lit ni n'écrit aucun fichier une fois démarré.
USER node
EXPOSE 8080
CMD ["node", "dist/index.js"]
