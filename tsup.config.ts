import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true, // Remember: Enable minify for production builds
  target: ["es2020", "chrome58", "edge16", "firefox57", "node12", "safari11"], // Emit modern ECMAScript
  
});