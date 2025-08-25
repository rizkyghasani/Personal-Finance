# backend/Dockerfile
FROM node:20

# Set direktori kerja di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Instal dependensi
RUN npm install

# Copy semua file proyek lainnya
COPY . .

# Expose port yang digunakan oleh aplikasi
EXPOSE 5000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "run", "dev"]
