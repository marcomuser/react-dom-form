import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: [
      {
        test: {
          name: "core",
          include: ["packages/core/test/**/*.test.{ts,tsx}"],
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
            include: ["packages/core/test/**/*.test-d.{ts,tsx}"],
            tsconfig: "./tsconfig.json",
          },
        },
      },
    ],
  },
});
