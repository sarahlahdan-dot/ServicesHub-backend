// middleware/verify-token.js

// We'll need to import jwt to use the verify method
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ err: 'JWT_SECRET is not configured.' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ err: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ err: 'Authorization token required.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assign decoded payload to req.user
    req.user = decoded.payload;

    // Call next() to invoke the next middleware function
    next();
  } catch (err) {
    // If any errors, send back a 401 status and an 'Invalid token.' error message
    return res.status(401).json({ err: 'Invalid token.' });
  }
}

// We'll need to export this function to use it in our controller files
module.exports = verifyToken;
