function errorHandler(err, _req, res, _next) {
  console.error('[Error]', err.message);

  if (err.isGroqError) {
    return res.status(502).json({
      error: { code: 'GROQ_ERROR', message: err.message },
    });
  }

  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
  });
}

module.exports = { errorHandler };
