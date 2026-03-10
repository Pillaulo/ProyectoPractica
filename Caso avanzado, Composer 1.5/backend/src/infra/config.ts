export interface Config {
  port: number;
  groqApiKey: string;
  nodeEnv: string;
  databasePath: string | null;
}

export function loadConfig(): Config {
  const port = parseInt(process.env.PORT ?? '3000', 10);
  const groqApiKey = process.env.GROQ_API_KEY ?? '';
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const databasePath = process.env.DATABASE_PATH ?? null;

  return {
    port,
    groqApiKey,
    nodeEnv,
    databasePath,
  };
}
