export const validateBody = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.validate(req.body);
    const hasValidationErrors = validationResult.error !== undefined;
    
    if (hasValidationErrors) {
      const validationErrorMessages = validationResult.error.details.map(
        errorDetail => errorDetail.message
      );
      
      return res.status(400).json({
        error: 'Request body validation failed',
        details: validationErrorMessages,
        hint: 'Please check the request body and ensure all fields are valid'
      });
    }
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.validate(req.query);
    const hasValidationErrors = validationResult.error !== undefined;
    
    if (hasValidationErrors) {
      const validationErrorMessages = validationResult.error.details.map(
        errorDetail => errorDetail.message
      );
      
      return res.status(400).json({
        error: 'Query parameters validation failed',
        details: validationErrorMessages,
        hint: 'Please check the query parameters and ensure they are valid'
      });
    }
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.validate(req.params);
    const hasValidationErrors = validationResult.error !== undefined;
    
    if (hasValidationErrors) {
      const validationErrorMessages = validationResult.error.details.map(
        errorDetail => errorDetail.message
      );
      
      return res.status(400).json({
        error: 'URL parameters validation failed',
        details: validationErrorMessages,
        hint: 'Please check the URL parameters and ensure they are valid'
      });
    }
    next();
  };
};