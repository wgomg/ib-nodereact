'use strict';

const BaseModel = require('./BaseModel');

function Themes() {
  BaseModel.call(this, {
    name: {
      type: 'alpha',
      length: 10,
      minLength: 2,
      required: true,
      unique: true
    },
    css: { type: 'css', length: 10000, required: true }
  });
}

Themes.prototype = Object.create(BaseModel.prototype);
Themes.prototype.constructor = Themes;

module.exports = Themes;
