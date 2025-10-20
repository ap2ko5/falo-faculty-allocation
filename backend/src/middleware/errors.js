// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Database errors
  if (err.code) {
    switch (err.code) {
      case '23505': // unique violation
        return res.status(409).json({
          error: 'Resource already exists',
          details: err.detail
        });
      case '23503': // foreign key violation
        return res.status(400).json({
          error: 'Invalid reference',
          details: err.detail
        });
      case '23502': // not null violation
        return res.status(400).json({
          error: 'Missing required field',
          details: err.detail
        });
      default:
        return res.status(500).json({
          error: 'Database error',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      details: 'The authentication token is malformed or expired'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.message
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Not found middleware
export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Not found',
    details: `Cannot ${req.method} ${req.originalUrl}`
  });
};