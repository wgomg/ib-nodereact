'use strict';

const jwt = require('jsonwebtoken');

const set = (staff) => {
  const payload = staff.staff_id;

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRATION
  });
};

const decode = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return decoded.staff;
};

module.exports = {
  set,
  decode
};
