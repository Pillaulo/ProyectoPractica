const { PORT, GROQ_API_KEY, DB_FILE_PATH } = require("./config/env");
const { initializeDatabase } = require("./infrastructure/db/sqlite");
const { GroqProvider } = require("./providers/groqProvider");
const { StorySessionRepository } = require("./repositories/storySessionRepository");
const { StoryService } = require("./services/storyService");
const { StoryController } = require("./controllers/storyController");
const { buildApp } = require("./app");

const startServer = async () => {
  const db = await initializeDatabase(DB_FILE_PATH);

  const groqProvider = new GroqProvider(GROQ_API_KEY);
  const storySessionRepository = new StorySessionRepository(db);
  const storyService = new StoryService({
    groqProvider,
    storySessionRepository,
  });
  const storyController = new StoryController(storyService);

  const app = buildApp({ storyController });
  app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error);
  process.exit(1);
});
