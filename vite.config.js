import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/ImageResize.ts"),
      name: "ImageResize",
      fileName: (format) => `index.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      plugins: [
        typescript({
          noForceEmit: true,
        }),
      ],
      external: ["quill"],
      output: {
        globals: { quill: "Quill" },
      },
    },
    minify: false,
  },
});
