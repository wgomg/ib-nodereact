'use strict';

const BaseModel = require('./BaseModel');

// Constructor
function Ban() {
  const classname = 'bans';

  const schema = {
    ban_id: { pk: true },
    staff_id: { type: 'table', required: true },
    post_id: { type: 'table', required: true },
    rule_id: { type: 'table', required: true },
    comment: { type: 'alphanum', length: 45, required: true }
  };

  BaseModel.call(this, classname, schema);
}

Ban.prototype = Object.create(BaseModel.prototype);

module.exports = new Ban();
