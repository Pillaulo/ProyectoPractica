const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");

const createStoryRoutes = (storyController) => {
  const router = express.Router();

  router.post("/story", asyncHandler(storyController.createStory));
  router.get("/sessions", asyncHandler(storyController.listSessions));
  router.get("/sessions/:id", asyncHandler(storyController.getSessionById));

  return router;
};

module.exports = {
  createStoryRoutes,
};
