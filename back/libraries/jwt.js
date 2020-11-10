'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config').jwt;

const set = (staff) => {
  const payload = staff.staff_id;

  return jwt.sign(payload, config.secret, { expiresIn: config.expiration });
};

const decode = (token) => {
  const decoded = jwt.verify(token, config.secret);

  return decoded.staff;
};

module.exports = {
  set,
  decode,
};
