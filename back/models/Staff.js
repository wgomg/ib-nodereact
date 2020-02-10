'use strict';

const BaseModel = require('./BaseModel');

const bcrypt = require('bcrypt');
const error = require('../utils/error');
const setJwtToken = require('../utils/setJwtToken');

/**
 * Constructor for Staff model
 */
function Staff() {
  const classname = 'staff';

  const schema = {
    staff_id: { pk: true },
    board_id: { type: 'table' },
    name: { type: 'alpha', length: 15, required: true, unique: true },
    email: { type: 'email', length: 30, required: true, unique: true },
    password: { type: 'alphanum', length: 20, required: true, hashed: true },
    admin: { type: 'bool', required: true },
    disabled: { type: 'bool' }
  };

  BaseModel.call(this, classname, schema);
}

// Inherit methods from BaseModel parent class
Staff.prototype = Object.create(BaseModel.prototype);

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
  BaseModel.prototype.getEntry.call(this, [{ email: object.email }, true], (err, res) => {
    if (err) callback(err, null);
    else {
      if (res.length === 0) callback(error({ code: 'ER_USER_NOTFOUND' }), null);
      else {
        const passwordMatch = bcrypt.compareSync(object.password, res[0].password);

        if (!passwordMatch) callback(error({ code: 'ER_INVALID_PASS' }));
        else setJwtToken(res[0], (err, res) => callback(err, res));
      }
    }
  });
};

// Authenticate staff
Staff.prototype.auth = function(staff, callback) {
  BaseModel.prototype.getEntry.call(this, staff.staff_id, (err, res) => callback(err, res));
};

const removePass = result =>
  result.map(entry => {
    delete entry.password;
    return entry;
  });

module.exports = new Staff();
