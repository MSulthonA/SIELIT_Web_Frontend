import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Menyediakan akses dari luar VPS
    port: 5173, // Gunakan port 5173
    strictPort: true, // Agar selalu menggunakan port yang sudah ditentukan
  },
});
