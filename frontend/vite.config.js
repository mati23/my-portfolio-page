import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// Preserve the previous Vite 4 compilation targets during the security upgrade.
	build: { target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"] },
	server: {
		host: "127.0.0.1",
		port: 8000
	}
})
