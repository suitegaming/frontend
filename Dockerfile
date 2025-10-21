# Etapa 1: Build
# Usa una imagen de Node.js para instalar dependencias y construir la aplicación
FROM node:20-alpine as builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de definición de paquetes e instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación para producción
# La variable VITE_API_URL se pasará en el entorno de despliegue de Dokploy
RUN npm run build

# Etapa 2: Serve
# Usa una imagen de Nginx para servir los archivos estáticos
FROM nginx:stable-alpine

# Copia los archivos construidos de la etapa anterior al directorio web de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
