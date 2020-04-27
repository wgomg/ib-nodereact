'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config').jwt;

const set = (staff) => {
  const payload = {
    staff: {
      staff_id: staff.staff_id,
      admin: staff.admin,
      board_id: staff.board_id,
      disabled: staff.disabled,
    },
  };

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
