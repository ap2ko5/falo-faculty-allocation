import Joi from 'joi';

// Auth schemas
export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().optional(),  // Allow but ignore on backend
  role: Joi.string().valid('faculty', 'admin').default('faculty'),
  name: Joi.string(),
  department_id: Joi.number().integer(),
  designation: Joi.string(),
  expertise: Joi.array().items(Joi.string()),
  preferences: Joi.array().items(Joi.string())
});

// Faculty schemas
export const createFacultySchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string(),
  department_id: Joi.number().integer().required(),
  role: Joi.string().valid('faculty', 'admin'),
  designation: Joi.string(),
  expertise: Joi.array().items(Joi.string()),
  preferences: Joi.array().items(Joi.string())
});

export const updateFacultySchema = Joi.object({
  username: Joi.string(),
  password: Joi.string().min(6),
  name: Joi.string(),
  department_id: Joi.number().integer(),
  role: Joi.string().valid('faculty', 'admin'),
  designation: Joi.string(),
  expertise: Joi.array().items(Joi.string()),
  preferences: Joi.array().items(Joi.string())
}).min(1);

// Course schemas
export const createCourseSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  department_id: Joi.number().integer().required(),
  semester: Joi.number().integer().min(1).max(8).required(),
  credits: Joi.number().integer().min(1).required(),
  required_expertise: Joi.array().items(Joi.string())
});

export const updateCourseSchema = Joi.object({
  code: Joi.string(),
  name: Joi.string(),
  department_id: Joi.number().integer(),
  semester: Joi.number().integer().min(1).max(8),
  credits: Joi.number().integer().min(1),
  required_expertise: Joi.array().items(Joi.string())
}).min(1);

// Allocation schemas
export const createAllocationSchema = Joi.object({
  faculty_id: Joi.number().integer().required(),
  class_id: Joi.number().integer().required(),
  course_id: Joi.number().integer().required(),
  academic_year: Joi.number().integer().required(),
  semester: Joi.number().integer().min(1).max(8).required(),
  status: Joi.string().valid('pending', 'approved', 'rejected').optional()
});

export const autoAllocateSchema = Joi.object({
  academic_year: Joi.number().integer().required(),
  semester: Joi.number().integer().min(1).max(8).required()
});