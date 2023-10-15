import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker'



// https://vitejs.dev/config/
export default defineConfig({

	server: {
		open: true,
	},

	plugins: [

		tsconfigPaths(),

		checker({ typescript: true }),

		react(),

	],

});
