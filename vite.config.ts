import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Agar bisa diakses di jaringan lokal
    port: 5173, // Sesuaikan dengan port yang Anda gunakan
    strictPort: true, // Memastikan Vite berjalan pada port ini
  },
  build: {
    outDir: "dist", // Direktori output bundling
  },
});
