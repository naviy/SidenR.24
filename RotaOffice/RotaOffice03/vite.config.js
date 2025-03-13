import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";
//import { viteSingleFile } from "vite-plugin-singlefile"
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths(),
        checker({ typescript: true }),
        react({
            babel: {
                plugins: [
                    ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
                ],
                //	parserOpts: {
                //		plugins: ["decorators"],
                //	},
            },
        }),
        //viteSingleFile(),
    ],
    server: {
        open: true,
        port: 5203,
    },
    build: {
        //emptyOutDir: false,
        sourcemap: true,
        minify: false,
        rollupOptions: {
            treeshake: true,
            output: {
                entryFileNames: "assets/index.js",
                chunkFileNames: "assets/index-chunk.js",
                assetFileNames: "assets/[name].[ext]",
            },
        },
    },
});
