import { randomBytes, scryptSync } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
const password = await new Promise((resolve) => {
  const stdin = process.stdin;
  let value = "";
  process.stdout.write("Enter the admin password (input hidden): ");
  stdin.setRawMode(true);
  stdin.resume();
  stdin.on("data", (chunk) => {
    const key = chunk.toString();
    if (key === "\u0003") process.exit(130);
    if (key === "\r" || key === "\n") {
      stdin.setRawMode(false);
      stdin.pause();
      process.stdout.write("\n");
      resolve(value);
    } else if (key === "\u007f") {
      value = value.slice(0, -1);
    } else {
      value += key;
    }
  });
});

if (!password || password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
const source = await readFile(envPath, "utf8");
const line = `ADMIN_PASSWORD_HASH=${hash}`;
const updated = /^ADMIN_PASSWORD_HASH=.*$/m.test(source)
  ? source.replace(/^ADMIN_PASSWORD_HASH=.*$/m, line)
  : `${source.trimEnd()}\n${line}\n`;
await writeFile(envPath, updated, "utf8");
console.log("Admin password hash saved to .env.local.");
