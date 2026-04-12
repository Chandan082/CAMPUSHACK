export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || err.status || 500;
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && err.stack && { stack: err.stack }),
  });
}
