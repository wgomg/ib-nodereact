const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).json('No toke, authorization denied');

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.staff = decoded.staff;

    return next();
  } catch (error) {
    res.status(401).json('Invalid token');
  }
};
