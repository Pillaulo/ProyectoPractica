const { parseStoryRequest } = require("../validators/storyValidator");
const { AppError } = require("../utils/appError");

class StoryController {
  constructor(storyService) {
    this.storyService = storyService;
  }

  createStory = async (req, res) => {
    const payload = parseStoryRequest(req.body);
    const story = await this.storyService.createStorySession(payload);
    res.status(200).json(story);
  };

  listSessions = async (_req, res) => {
    const sessions = await this.storyService.listSessions();
    res.status(200).json(sessions);
  };

  getSessionById = async (req, res) => {
    const sessionId = Number(req.params.id);
    if (Number.isNaN(sessionId) || sessionId <= 0) {
      throw new AppError(400, "VALIDATION_ERROR", "El id de sesion no es valido.");
    }

    const session = await this.storyService.getSessionDetail(sessionId);
    res.status(200).json(session);
  };
}

module.exports = {
  StoryController,
};
