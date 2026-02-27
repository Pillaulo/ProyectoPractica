const groqProvider = require('../providers/groqProvider');
const storyRepository = require('../repositories/storyRepository');

async function createStory(validatedRequest) {
  const story = await groqProvider.generateStory(validatedRequest);
  storyRepository.saveSession(validatedRequest, story);
  return story;
}

function listSessions() {
  return storyRepository.getAllSessions();
}

function getSession(id) {
  return storyRepository.getSessionById(id);
}

module.exports = { createStory, listSessions, getSession };
