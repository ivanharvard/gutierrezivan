import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// Server refreshes with any change made
		hmr: true,
		watch: {
			usePolling: true
		}
	}
});
