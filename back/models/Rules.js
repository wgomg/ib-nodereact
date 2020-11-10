'use strict';

const BaseModel = require('./BaseModel');

function Rules() {
  BaseModel.call(this, {
    board_id: { type: 'table' },
    short_text: { type: 'alphanum', length: 45, required: true },
    ban_duration: { type: 'num', required: true },
    apply_on: { type: 'list|post,file', required: true },
    long_text: { type: 'string', length: 250 },
  });
}

Rules.prototype = Object.create(BaseModel.prototype);
Rules.prototype.constructor = Rules;

module.exports = Rules;
