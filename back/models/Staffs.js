'use strict';

const BaseModel = require('./BaseModel');

function Staffs() {
  BaseModel.call(this, {
    board_id: { type: 'table' },
    name: { type: 'alpha', length: 15, required: true, unique: true },
    password: { type: 'alphanum', length: 20 },
    admin: { type: 'bool' },
    disabled: { type: 'bool' },
    last_login: { type: 'timestamp' },
  });
}

Staffs.prototype = Object.create(BaseModel.prototype);
Staffs.prototype.constructor = Staffs;

module.exports = Staffs;
