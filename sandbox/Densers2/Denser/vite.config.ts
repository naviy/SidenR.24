import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react';




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
