import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [
        {
          browser: "chromium",
        },
      ],
    },
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.json",
    },
    workspace: [
      {
        extends: true,
        test: {
          name: "core",
          include: ["packages/core/test/**/*.test.{ts,tsx}"],
          typecheck: {
            include: ["packages/core/test/**/*.test-d.{ts,tsx}"],
          },
        },
      },
    ],
  },
});
