FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install esbuild@0.21.5 --force
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]