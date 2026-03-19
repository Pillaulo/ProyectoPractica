/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

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

  await client.query(`DELETE FROM "Story"`);
  await client.query(`DELETE FROM "ChildProfile"`);
  await client.query(`DELETE FROM "User"`);

  const passwordHash = await bcrypt.hash("admin", 10);
  await client.query(
    `INSERT INTO "User" ("id","email","passwordHash","role","status","createdAt","updatedAt")
     VALUES ($1,$2,$3,'ADMIN'::"Role",'ACTIVE'::"UserStatus",NOW(),NOW())`,
    [randomUUID(), "admin@admin.com", passwordHash],
  );

  await client.end();
  console.log("Usuarios eliminados y admin de prueba creado: admin@admin.com / admin");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

