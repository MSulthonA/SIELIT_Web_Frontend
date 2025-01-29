import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Pastikan server mendengarkan di semua network interfaces
    hmr: {
      protocol: "wss", // Gunakan wss untuk koneksi WebSocket di HTTPS
      host: "bki.hcorp.my.id", // Host domain Anda
      port: 443,
    },
  },
});
