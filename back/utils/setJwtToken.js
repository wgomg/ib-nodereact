const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (staff, callback) => {
  const payload = {
    staff: {
      staff_id: staff.staff_id,
      admin: staff.admin,
      board: staff.board_id,
      disabled: staff.disabled
    }
  };

  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiration }, (err, token) => {
    if (err) callback(err, null);
    else callback(null, { token });
  });
};
