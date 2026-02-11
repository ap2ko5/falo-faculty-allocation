export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const isDatabaseError = err.code !== undefined;

  if (isDatabaseError) {
    switch (err.code) {
      case '23505': // unique violation
        return res.status(409).json({
          error: 'Duplicate entry',
          details: err.detail,
          hint: 'This record already exists in the database'
        });
      case '23503': // foreign key violation
        return res.status(400).json({
          error: 'Invalid reference',
          details: err.detail,
          hint: 'The referenced record does not exist'
        });
      case '23502': // not null violation
        return res.status(400).json({
          error: 'Missing required field',
          details: err.detail,
          hint: 'Please provide all required fields'
        });
      default:
        const isDevEnvironment = process.env.NODE_ENV === 'development';
        return res.status(500).json({
          error: 'Database error',
          details: isDevEnvironment ? err.message : 'An error occurred while processing your request'
        });
    }
  }

  const isJwtError = err.name === 'JsonWebTokenError';
  
  if (isJwtError) {
    return res.status(401).json({
      error: 'Authentication failed',
      details: 'The authentication token is malformed or expired',
      hint: 'Please log in again to obtain a new token'
    });
  }

  const isValidationError = err.name === 'ValidationError';
  
  if (isValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.message,
      hint: 'Please check your input and try again'
    });
  }

  const isDevEnvironment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: 'Internal server error',
    details: isDevEnvironment ? err.message : 'An unexpected error occurred'
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Not found',
    details: `Cannot ${req.method} ${req.originalUrl}`
  });
};