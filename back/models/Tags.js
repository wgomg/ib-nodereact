'use strict';

const BaseModel = require('./BaseModel');

function Tags() {
  BaseModel.call(this, {
    tag: { type: 'tag', length: 3, required: true },
    name: {
      type: 'alpha',
      length: 10,
      minLength: 2,
      required: true,
      unique: true,
    },
    prefix_replacer: {
      type: 'string',
      length: 50,
      required: true,
      unique: true,
    },
    postfix_replacer: { type: 'string', length: 50, required: true },
    css: { type: 'css', length: 250 },
  });
}

Tags.prototype = Object.create(BaseModel.prototype);
Tags.prototype.constructor = Tags;

module.exports = Tags;
