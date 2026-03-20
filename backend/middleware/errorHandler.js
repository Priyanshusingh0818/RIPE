/**
 * Global Express error handler middleware.
 * Catches any unhandled errors and returns a clean JSON response.
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
