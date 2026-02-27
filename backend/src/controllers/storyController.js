const { validateStoryRequest } = require('../validators/storyValidator');
const storyService = require('../services/storyService');

async function createStory(req, res, next) {
  try {
    const validation = validateStoryRequest(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: validation.error },
      });
    }

    const story = await storyService.createStory(validation.data);
    return res.json(story);
  } catch (err) {
    next(err);
  }
}

function listSessions(_req, res, next) {
  try {
    const sessions = storyService.listSessions();
    return res.json(sessions);
  } catch (err) {
    next(err);
  }
}

function getSession(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'ID inválido' },
      });
    }

    const session = storyService.getSession(id);
    if (!session) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Sesión no encontrada' },
      });
    }

    return res.json(session);
  } catch (err) {
    next(err);
  }
}

module.exports = { createStory, listSessions, getSession };
