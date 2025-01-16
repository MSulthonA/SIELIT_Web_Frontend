import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Mengizinkan akses dari luar localhost
    port: 5173, // Port default (ubah jika diperlukan)
    strictPort: true, // Pastikan Vite gagal jika port tidak tersedia
    https: true, // Set ke true jika menggunakan HTTPS
  },
});
