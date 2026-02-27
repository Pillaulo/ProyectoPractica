const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

if (!GROQ_API_KEY) {
  throw new Error("Falta la variable de entorno GROQ_API_KEY.");
}

if (!DATABASE_URL) {
  throw new Error("Falta la variable de entorno DATABASE_URL.");
}

const resolveDatabaseFile = (databaseUrl) => {
  if (databaseUrl === ":memory:") {
    return databaseUrl;
  }

  if (databaseUrl.startsWith("file:")) {
    const withoutPrefix = databaseUrl.slice(5).split("?")[0];
    return path.isAbsolute(withoutPrefix)
      ? withoutPrefix
      : path.join(process.cwd(), withoutPrefix);
  }

  return path.isAbsolute(databaseUrl)
    ? databaseUrl
    : path.join(process.cwd(), databaseUrl);
};

module.exports = {
  PORT,
  GROQ_API_KEY,
  DATABASE_URL,
  FRONTEND_ORIGIN,
  DB_FILE_PATH: resolveDatabaseFile(DATABASE_URL),
};
