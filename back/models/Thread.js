'use strict';

const BaseModel = require('./BaseModel');

/**
 * Constructor for Staff model
 */
function Thread() {
  const classname = 'thread';

  const schema = {
    thread_id: { pk: true },
    board_id: { type: 'table', required: true },
    subject: { type: 'alphanum', length: 45 }
  };

  BaseModel.call(this, classname, schema);
}

// Inherit methods from BaseModel parent class
Thread.prototype = Object.create(BaseModel.prototype);

module.exports = new Thread();
