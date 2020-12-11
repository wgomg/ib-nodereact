'use strict';

const BaseModel = require('./BaseModel');

function Rules() {
  BaseModel.call(this, {
    board_id: { type: 'int' },
    short_text: {
      type: 'string',
      regex: '^([a-zA-Z0-9 ])',
      minlength: 10,
      maxlength: 45,
      required: true
    },
    ban_duration: { type: 'int', required: true },
    apply_on: { type: 'list|post,file', required: true },
    long_text: { type: 'string', minlength: 10, maxlength: 250 }
  });
}

Rules.prototype = Object.create(BaseModel.prototype);
Rules.prototype.constructor = Rules;

module.exports = Rules;
