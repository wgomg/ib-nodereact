'use strict';

const BaseModel = require('./BaseModel');

const bcrypt = require('bcrypt');
const error = require('../utils/error');
const setJwtToken = require('../utils/setJwtToken');

function Staff() {
  const classname = 'staff';

  const schema = {
    staff_id: { pk: true },
    board_id: { type: 'table' },
    name: { type: 'alpha', length: 15, required: true, unique: true },
    password: { type: 'alphanum', length: 20, hashed: true },
    admin: { type: 'bool' },
    disabled: { type: 'bool' }
  };

  BaseModel.call(this, classname, schema);
}

Staff.prototype = Object.create(BaseModel.prototype);

Staff.prototype.saveEntry = function(entry, callback) {
  if (!entry.staff_id) entry.password = entry.name;

  BaseModel.prototype.saveEntry.call(this, entry, (err, res) => callback(err, res));
};

// Custom getAllEntries for removing password field from retrieved entries
Staff.prototype.getAllEntries = function(callback) {
  BaseModel.prototype.getAllEntries.call(this, (err, res) => {
    if (err) callback(err, null);
    else callback(null, removePass(res));
  });
};

// Custom getEntry for removing password field from retrieved entry
Staff.prototype.getEntry = function(filters, callback) {
  BaseModel.prototype.getEntry.call(this, filters, (err, res) => {
    if (err) callback(err, null);
    else callback(null, removePass(res));
  });
};

// Login staff
Staff.prototype.login = function(object, callback) {
  BaseModel.prototype.getEntry.call(this, [{ name: object.name }, true], (err, res) => {
    if (err) return callback(err, null);

    if (res.length === 0) return callback(error({ code: 'ER_USER_NOTFOUND' }), null);

    const passwordMatch = bcrypt.compareSync(object.password, res[0].password);

    if (!passwordMatch) callback(error({ code: 'ER_INVALID_PASS' }));
    else setJwtToken(res[0], (err, res) => callback(err, res));
  });
};

// Authenticate staff
Staff.prototype.auth = function(staff, callback) {
  BaseModel.prototype.getEntry.call(this, [{ staff_id: staff.staff_id }], (err, res) => {
    if (err) return callback(err, null);

    const staff = {
      staff_id: res[0].staff_id,
      name: res[0].name,
      admin: res[0].admin,
      disabled: res[0].disabled
    };

    callback(null, staff);
  });
};

const removePass = result =>
  result.map(entry => {
    delete entry.password;
    return entry;
  });

module.exports = new Staff();
