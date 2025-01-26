# Menggunakan Node.js untuk build tahap awal
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek ke dalam image
COPY . .

# Build aplikasi frontend
RUN npm run build

# Tahap produksi: menggunakan Nginx untuk serving
FROM nginx:1.25-alpine

# Salin hasil build ke Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Salin konfigurasi Nginx jika diperlukan
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
