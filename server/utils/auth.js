const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware function for authenticating routes
  authMiddleware: function (req, res, next) {
    // Allow token to be sent via req.query or headers
    let token = req.query.token || req.headers.authorization;

    // Separate token from "Bearer" prefix if present in headers
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // If no token is found, return a 400 response
    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    // Verify token and extract user data
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      // Move to the next endpoint
      next();
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'Invalid token!' });
    }
  },
  // Function to sign a token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
