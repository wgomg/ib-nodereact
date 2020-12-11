'use strict';

const BaseModel = require('./BaseModel');

function Settings() {
  BaseModel.call(this, {
    name: {
      type: 'string',
      regex: '^([a-zA-Z_])',
      minlength: 3,
      maxlength: 25,
      required: true
    },
    value: {
      type: 'string',
      regex: '^([a-zA-Z0-9_])',
      maxlength: 100,
      required: true
    }
  });
}

Settings.prototype = Object.create(BaseModel.prototype);
Settings.prototype.constructor = Settings;

module.exports = Settings;
