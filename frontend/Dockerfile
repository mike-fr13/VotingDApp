# Étape 1 : Construire l'application React Next.js
FROM node:16.16.0-alpine as builder

WORKDIR /app

# Copier les fichiers de package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers de l'application
COPY . ./

# Construire l'application React Next.js
RUN npm list
RUN npm run build

# Étape 2 : Exécuter l'application construite
FROM node:16.16.0-alpine

WORKDIR /app

# Copier les fichiers de package.json et package-lock.json
COPY --from=builder /app/package*.json ./

# Installer les dépendances de production
RUN npm ci --production

# Copier l'application construite
COPY --from=builder /app/.next ./.next

# Exposer le port sur lequel l'application va écouter
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start"]