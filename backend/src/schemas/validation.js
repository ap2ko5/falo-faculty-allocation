import Joi from 'joi';

// Auth schemas
export const loginSchema = Joi.object({
  email: Joi.string().required(), // Changed from email() to string() to allow usernames
  password: Joi.string().required()
});

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  department_id: Joi.number().integer().required(),
  role: Joi.string().valid('faculty', 'admin').default('faculty'),
  designation: Joi.string(),
  expertise: Joi.array().items(Joi.string()),
  preferences: Joi.array().items(Joi.string())
});

// Faculty schemas
export const createFacultySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  department_id: Joi.number().integer().required(),
  designation: Joi.string(),
  expertise: Joi.array().items(Joi.string()),
  preferences: Joi.array().items(Joi.string())
});

export const updateFacultySchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  department_id: Joi.number().integer(),
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
  semester: Joi.number().integer().min(1).max(8).required()
});

export const autoAllocateSchema = Joi.object({
  academic_year: Joi.number().integer().required(),
  semester: Joi.number().integer().min(1).max(8).required()
});

// Timetable schemas
export const createTimetableSchema = Joi.object({
  allocation_id: Joi.number().integer().required(),
  day_of_week: Joi.number().integer().min(1).max(5).required(),
  time_slot: Joi.number().integer().min(1).max(8).required(),
  room_number: Joi.string().required()
});