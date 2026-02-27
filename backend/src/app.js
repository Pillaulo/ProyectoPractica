const express = require("express");
const cors = require("cors");
const { FRONTEND_ORIGIN } = require("./config/env");
const { errorMiddleware } = require("./utils/errorMiddleware");
const { createStoryRoutes } = require("./routes/storyRoutes");

const buildApp = ({ storyController }) => {
  const app = express();
  const allowedOrigins = FRONTEND_ORIGIN.split(",").map((origin) => origin.trim());
  const localhostPattern = /^http:\/\/localhost:\d+$/;

  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          localhostPattern.test(origin)
        ) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use("/api", createStoryRoutes(storyController));
  app.use(errorMiddleware);

  return app;
};

module.exports = {
  buildApp,
};
