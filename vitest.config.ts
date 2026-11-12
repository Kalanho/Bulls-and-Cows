import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", "dist", "coverage"],
    environment: "node",
  },
  resolve: {
    // чтобы импорт './x.js' находил './x.ts' (как в ESM + tsc)
    extensions: [".ts", ".js", ".json"],
  },
});
