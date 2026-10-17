import { spawnSync } from "node:child_process";

// Build the URL from the same settings as the app, including escaped credentials.
const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } = process.env;
for (const key of ["DATABASE_USER", "DATABASE_PASSWORD", "DATABASE_HOST", "DATABASE_NAME"]) {
  if (!process.env[key]) throw new Error(`${key} is required`);
}
const databaseUrl = `mysql://${encodeURIComponent(DATABASE_USER)}:${encodeURIComponent(DATABASE_PASSWORD)}@${DATABASE_HOST}:${DATABASE_PORT ?? "3306"}/${encodeURIComponent(DATABASE_NAME)}`;
const result = spawnSync("./node_modules/.bin/prisma", ["migrate", "deploy"], {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: databaseUrl },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
