import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env.test in tests and in CI (GitHub Actions), otherwise .env.local
const envFile =
  process.env.NODE_ENV === "test" || process.env.CI ? ".env.test" : ".env.local";
config({ path: envFile });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
