'use strict';

const BaseModel = require('./BaseModel');

function Tags() {
  BaseModel.call(this, {
    tag: {
      type: 'string',
      regex: '^([^a-zA-Z0_9 ])',
      minlength: 2,
      maxlength: 3,
      required: true
    },
    name: {
      type: 'string',
      regex: '^([a-z])',
      minlength: 2,
      maxlength: 10,
      required: true,
      unique: true
    },
    prefix_replacer: {
      type: 'string',
      regex: '^([<>="a-zA-Z/\\-_0-9])',
      minlength: 3,
      maxlength: 50,
      required: true,
      unique: true
    },
    post_replacer: {
      type: 'string',
      regex: '^([<>a-zA-Z/])',
      minlength: 4,
      maxlength: 50,
      required: true,
      unique: true
    },
    css: { type: 'string', maxlength: 250 },
    full_line: { type: 'bool' }
  });
}

Tags.prototype = Object.create(BaseModel.prototype);
Tags.prototype.constructor = Tags;

module.exports = Tags;
