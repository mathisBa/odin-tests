// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // match only your unit-test files
    include: ["src/**/*.test.{ts,tsx,js}"],
    // exclude playwright / e2e
    exclude: ["tests/e2e/**", "**/*.e2e.*"],
  },
});
