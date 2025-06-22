const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('No Authorization header');
    return res.status(401).json({ message: 'No token' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token found in header');
    return res.status(401).json({ message: 'No token' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token valid, user:', req.user);
    next();
  } catch (err) {
    console.log('Invalid token');
    res.status(401).json({ message: 'Invalid token' });
  }
};
