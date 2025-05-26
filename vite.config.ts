import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const backendPort = env.VITE_BACKEND_PORT;

	return {
		plugins: [react(), tailwindcss()],
		base: "./",
		server: {
			proxy: {
				"/api": {
					target: `http://localhost:${backendPort}`,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			},
		},
	};
});
