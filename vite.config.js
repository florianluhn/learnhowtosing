import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// Load environment variables dynamically, including ones without the VITE_ prefix (like PORT)
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [sveltekit()],
		server: {
			port: env.PORT ? parseInt(env.PORT, 10) : 5173,
			strictPort: true // Tells Vite to throw an error if the port is already in use
		}
	};
});
