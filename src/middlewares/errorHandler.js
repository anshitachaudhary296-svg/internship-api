/**
 * Centralized Error Handling Middleware
 * 
 * Captures all application errors and delivers consistent JSON responses.
 */

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Handle JSON syntax error from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload. Please verify your request body syntax.'
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`🚨 [Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = { errorHandler };
