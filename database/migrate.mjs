import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import pg from "pg";

const { Pool } = pg;
const connectionString = (() => {
  if (!process.env.DATABASE_URL) return undefined;
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.delete("channel_binding");
  url.searchParams.delete("sslmode");
  return url.toString();
})();

if (!connectionString) {
  console.error("DATABASE_URL is required to run migrations.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 30_000,
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
});

try {
  const migrationDirectory = resolve("database", "migrations");
  const files = (await readdir(migrationDirectory)).filter((file) => file.endsWith(".sql")).sort();
  for (const file of files) {
    await pool.query(await readFile(resolve(migrationDirectory, file), "utf8"));
    console.log(`Applied ${file}`);
  }
  console.log("PostgreSQL migrations completed.");
} catch (error) {
  console.error("PostgreSQL migration failed.", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}