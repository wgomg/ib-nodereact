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
    email: { type: 'email', required: true, unique: true, hashed: true },
    password: { type: 'alphanum', length: 20, required: true, hashed: true },
    admin: { type: 'bool', required: true },
    disabled: { type: 'bool' }
  };

  BaseModel.call(this, classname, schema);
}

// Inherit methods from BaseModel parent class
Staff.prototype = Object.create(BaseModel.prototype);

module.exports = new Staff();
