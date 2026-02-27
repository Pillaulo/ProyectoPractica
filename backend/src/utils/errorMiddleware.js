const { ZodError } = require("zod");

const errorMiddleware = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: error.issues.map((issue) => issue.message).join(", "),
      },
    });
  }

  if (error.statusCode && error.code) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Ocurrio un error inesperado.",
    },
  });
};

module.exports = {
  errorMiddleware,
};
