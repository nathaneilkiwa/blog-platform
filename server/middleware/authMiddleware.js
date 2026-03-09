// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  console.log('=== Auth Middleware ===');
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      console.log('Token received, length:', token.length);
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log('Decoded token:', decoded);
      
      // Set user from token payload
      req.user = { 
        id: decoded.id,
        _id: decoded.id, // Add _id for mongoose compatibility
        name: decoded.name,
        email: decoded.email 
      };
      
      console.log('User authenticated:', req.user.email);
      console.log('=== Auth Success ===');
      
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      
      return res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    console.log('No Bearer token in Authorization header');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;