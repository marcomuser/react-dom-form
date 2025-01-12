import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      include: ["packages/*/test/unit/*.test.{ts,tsx}"],
      name: "node",
      environment: "node",
      typecheck: {
        enabled: true,
        tsconfig: "./tsconfig.json",
      },
    },
  },
  {
    test: {
      include: ["packages/*/test/browser/*.test.{ts,tsx}"],
      name: "browser",
      browser: {
        enabled: true,
        provider: "playwright",
        name: "chromium",
      },
    },
  },
]);
