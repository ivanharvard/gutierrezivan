import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            // By default, the adapter will output to the 'build' directory,
            // but you can specify your own paths for pages and assets.
            pages: 'build',  // Where to output the built pages
            assets: 'build',  // Where to output the assets (images, styles, etc.)
            fallback: 'index.html',
			strict: false    // As long as you have no other subdirectories, this is fine
        }),
        // Optional: configure the paths for the base (useful if deploying to a subdirectory)
        // paths: {
        //     base: '/your-subdirectory',
        // },
    }
};

export default config;
