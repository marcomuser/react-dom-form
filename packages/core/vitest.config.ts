import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
  test: {
    environment: "node",
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.json",
    },
  },
});

export default config;
