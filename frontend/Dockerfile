# Stage 1: Build React (Vite) App
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

# Pastikan esbuild versi yang sesuai
RUN npm install esbuild@0.21.5 --force

COPY . .
RUN npm run build

# Stage 2: Nginx untuk serve frontend
FROM nginx:stable-alpine as production-stage

# Copy hasil build ke nginx html
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Hapus default config bawaan nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
