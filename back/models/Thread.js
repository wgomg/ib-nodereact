'use strict';

const BaseModel = require('./BaseModel');

function Thread() {
  const classname = 'thread';

  const schema = {
    thread_id: { pk: true },
    board_id: { type: 'table', required: true },
    subject: { type: 'alphanum', length: 45 }
  };

  BaseModel.call(this, classname, schema);
}

Thread.prototype = Object.create(BaseModel.prototype);

module.exports = new Thread();
