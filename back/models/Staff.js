'use strict';

const BaseModel = require('./BaseModel');

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
Staff.prototype.getEntry = function(id, callback) {
  BaseModel.prototype.getEntry.call(this, id, (err, res) => {
    if (err) callback(err, null);
    else callback(null, removePass(res));
  });
};

const removePass = result =>
  result.map(entry => {
    delete entry.password;
    return entry;
  });

module.exports = new Staff();
