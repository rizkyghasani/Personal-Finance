# Stage 1: Build Vite
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install esbuild@0.21.5 --force
COPY . .
RUN npm run build

# Stage 2: Nginx server
FROM nginx:stable-alpine as production-stage

# Copy build hasil Vite
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy konfigurasi custom Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
