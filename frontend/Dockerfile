# frontend/Dockerfile
# Gunakan image Node.js yang lebih baru untuk kompatibilitas Vite
FROM node:20-alpine as build-stage

# Set direktori kerja
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Instal esbuild versi spesifik untuk mengatasi masalah kompatibilitas
RUN npm install esbuild@0.21.5 --force

# Copy semua file proyek
COPY . .

# Jalankan build produksi
RUN npm run build

# Stage 2: Gunakan Nginx sebagai web server
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
