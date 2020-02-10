const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (staff, callback) => {
  const payload = { staff: { id: staff.staff_id } };

  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiration }, (err, token) => {
    if (err) callback(err, null);
    else callback(null, { token });
  });
};
