/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function getDatabaseUrlFromEnv() {
  const envPath = path.join(process.cwd(), ".env");
  const raw = fs.readFileSync(envPath, "utf8");
  const line = raw
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith("DATABASE_URL="));

  if (!line) {
    throw new Error("DATABASE_URL no encontrado en .env");
  }

  return line.split("=")[1].trim().replace(/^"|"$/g, "");
}

async function main() {
  const client = new Client({ connectionString: getDatabaseUrlFromEnv() });
  await client.connect();
  const result = await client.query(
    `SELECT "id","title","contentText","contentJson"
     FROM "Story"
     ORDER BY "createdAt" DESC
     LIMIT 1`,
  );
  await client.end();
  console.log(JSON.stringify(result.rows[0] ?? null, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

