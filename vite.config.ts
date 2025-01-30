import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: "http://apibki.hcorp.my.id", // Ganti dengan alamat backend HTTP yang sesuai
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ""), // Menghapus /auth di awal URL saat diteruskan ke backend
      },
    },
  },
});
