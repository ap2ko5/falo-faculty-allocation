import jwt from 'jsonwebtoken';
import { config } from '../config/database.js';

export const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const bearerToken = authorizationHeader?.split(' ')[1];
    
    const tokenNotProvided = !bearerToken;
    
    if (tokenNotProvided) {
      return res.status(401).json({ 
        error: 'Authentication required',
        details: 'No authentication token provided',
        hint: 'Please include a valid token in the Authorization header'
      });
    }

    const decodedTokenPayload = jwt.verify(bearerToken, config.jwtSecret);
    req.user = decodedTokenPayload;
    next();
  } catch (err) {
    res.status(401).json({ 
      error: 'Authentication failed',
      details: 'The provided token is invalid or expired',
      hint: 'Please log in again to obtain a new token'
    });
  }
};

export const isAdmin = (req, res, next) => {
  const userIsAdmin = req.user.role === 'admin';
  
  if (!userIsAdmin) {
    return res.status(403).json({ 
      error: 'Access denied',
      details: 'This action requires administrator privileges',
      hint: 'Please contact an administrator if you need access'
    });
  }
  next();
};

export const isFaculty = (req, res, next) => {
  const userIsFaculty = req.user.role === 'faculty';
  
  if (!userIsFaculty) {
    return res.status(403).json({ 
      error: 'Access denied',
      details: 'This action requires faculty privileges',
      hint: 'This resource is only accessible to faculty members'
    });
  }
  next();
};