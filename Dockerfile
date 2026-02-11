# ==========================================
# Etapa 1: Construcción (Builder)
# ==========================================
FROM node:20-alpine as builder

# INSTALACIÓN CRÍTICA:
# Añadimos libc6-compat para compatibilidad con binarios de esbuild/sass en Alpine
RUN apk add --no-cache libc6-compat

# Aumentar límite de memoria para Node.js (Vite/Rollup pueden ser pesados)
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

# 1. Copiamos solo los archivos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

# 2. Instalamos dependencias
# Usamos --no-audit para velocidad y --no-cache para no llenar el disco temporalmente
RUN npm install --no-audit --no-fund

# 3. Copiamos el resto del código fuente (respetando el .dockerignore)
COPY . .

# 4. Construimos la aplicación
RUN npm run build

# ==========================================
# Etapa 2: Servidor Producción (Nginx)
# ==========================================
FROM nginx:stable-alpine as production

# Copia la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos generados en la etapa 'builder'
# La carpeta de salida de Vite por defecto es 'dist'
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
