import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  base: "./",
  public: "public",
  // publicDir: false,
  build: {
    outDir: "dist",
    rollupOptions: {
      external: ["keys.js"],
      output: {
        paths: {
          "keys.js": "../keys.js"
        }
      },
    }
  }
});
