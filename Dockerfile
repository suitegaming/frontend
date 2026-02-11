# Etapa 1: Build
# Usa una imagen diferente para romper la caché corrupta y una versión ligera
FROM node:lts-alpine as builder

# Aumentar límite de memoria para evitar cuelgues (ajustar según tu VPS, 2GB es seguro)
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de definición de paquetes e instala las dependencias
COPY package.json ./
# Usamos --no-audit para acelerar y --legacy-peer-deps por si acaso
RUN npm install --no-audit --legacy-peer-deps

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Serve
FROM nginx:stable-alpine

# Copia los archivos construidos de la etapa anterior al directorio web de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
