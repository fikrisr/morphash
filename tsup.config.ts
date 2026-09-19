import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".mjs" : ".cjs",
      };
    },
    sourcemap: false,
  },
  {
    entry: {
      morphash: "src/index.ts",
    },
    format: ["iife"],
    globalName: "Morphash",
    minify: true,
    outDir: "dist",
  },
]);
