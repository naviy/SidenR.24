import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from "vite-plugin-singlefile"




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
	},

});
