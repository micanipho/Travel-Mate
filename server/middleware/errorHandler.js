// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let error = {
    error: 'Internal server error',
    message: 'Something went wrong'
  };

  let statusCode = 500;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    error = {
      error: 'Validation error',
      message: err.message
    };
  } else if (err.name === 'CastError') {
    statusCode = 400;
    error = {
      error: 'Invalid data format',
      message: 'Invalid ID format'
    };
  } else if (err.code === '23505') { // PostgreSQL unique constraint violation
    statusCode = 409;
    error = {
      error: 'Conflict',
      message: 'Resource already exists'
    };
  } else if (err.code === '23503') { // PostgreSQL foreign key constraint violation
    statusCode = 400;
    error = {
      error: 'Invalid reference',
      message: 'Referenced resource does not exist'
    };
  } else if (err.code === '23502') { // PostgreSQL not null constraint violation
    statusCode = 400;
    error = {
      error: 'Missing required field',
      message: 'Required field cannot be null'
    };
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    error = {
      error: 'Authentication failed',
      message: 'Invalid token'
    };
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    error = {
      error: 'Authentication failed',
      message: 'Token expired'
    };
  } else if (err.message && err.message.includes('duplicate key')) {
    statusCode = 409;
    error = {
      error: 'Conflict',
      message: 'Resource already exists'
    };
  }

  // In development, include stack trace
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(statusCode).json(error);
};

// 404 Not Found handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
