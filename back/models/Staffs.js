'use strict';

const BaseModel = require('./BaseModel');

function Staffs() {
  BaseModel.call(this, {
    board_id: { type: 'int' },
    name: {
      type: 'string',
      regex: '^([a-zA-Z_])',
      minlength: 4,
      maxlength: 15,
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      regex: '^([a-zA-Z]+[0-9]{2,}[|#$%&\\*\\-_~]{2,})',
      minlength: 20,
      maxlength: 64
    },
    admin: { type: 'bool' },
    disabled: { type: 'bool' }
  });
}

Staffs.prototype = Object.create(BaseModel.prototype);
Staffs.prototype.constructor = Staffs;

module.exports = Staffs;
