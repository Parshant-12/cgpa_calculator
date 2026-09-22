const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header (Format: "Bearer <token>")
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. Invalid token format.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Adds user payload (id) to request object
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};