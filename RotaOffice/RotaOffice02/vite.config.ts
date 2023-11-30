import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react';
//import { viteSingleFile } from "vite-plugin-singlefile"




// https://vitejs.dev/config/
export default defineConfig({

	plugins: [

		tsconfigPaths(),

		checker({ typescript: true }),

		react(),

		//viteSingleFile(),

	],

	server: {
		open: true,
		port: 5176,
	},

	build: {

		//emptyOutDir: false,
		sourcemap: true,
		minify: false,

		rollupOptions: {
			treeshake: true,
			output: {
				entryFileNames: `assets/index.js`,
				chunkFileNames: `assets/index-chunk.js`,
				assetFileNames: `assets/[name].[ext]`,
			},
		},

	},


});
