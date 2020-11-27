'use strict';

const BaseModel = require('./BaseModel');

function Settings() {
  BaseModel.call(this, {
    name: { type: 'alpha', required: true, length: 25 },
    value: { type: 'string', required: true, length: 100 },
  });
}

Settings.prototype = Object.create(BaseModel.prototype);
Settings.prototype.constructor = Settings;

module.exports = Settings;
