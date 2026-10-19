# ============================
# Étape 1 : Build avec Node 22
# ============================
FROM node:22-alpine AS builder

WORKDIR /app

# Copier d'abord les fichiers de dépendances pour le cache
COPY package*.json ./

# Installer les dépendances (npm ci est plus strict et reproductible)
RUN npm ci --legacy-peer-deps

# Copier les sources puis build
COPY . .
RUN npm run build

# ============================
# Étape 2 : Nginx pour servir le build
# ============================
FROM nginx:1.27-alpine

# Configuration Nginx custom
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build depuis l'étape 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
