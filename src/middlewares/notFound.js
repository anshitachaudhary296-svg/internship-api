/**
 * 404 Not Found Middleware
 * 
 * Handles any incoming requests targeting undefined routes.
 */

function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: cannot ${req.method} ${req.originalUrl}`
  });
}

module.exports = { notFound };
