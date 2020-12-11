'use strict';

const BaseModel = require('./BaseModel');

function Themes() {
  BaseModel.call(this, {
    name: {
      type: 'string',
      regex: '^([a-zA-Z])',
      minlength: 2,
      maxlength: 10,
      required: true,
      unique: true
    },
    css: { type: 'string', maxlength: 10000, required: true }
  });
}

Themes.prototype = Object.create(BaseModel.prototype);
Themes.prototype.constructor = Themes;

module.exports = Themes;
