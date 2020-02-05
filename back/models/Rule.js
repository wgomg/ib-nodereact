'use strict';

const BaseModel = require('./BaseModel');

// Constructor
function Rule() {
  const classname = 'rules';

  const schema = {
    rule_id: { pk: true },
    board_id: { type: 'table' },
    text: { type: 'alphanum', length: 45, required: true },
    details: { type: 'string', length: 250 }
  };

  BaseModel.call(this, classname, schema);
}

Rule.prototype = Object.create(BaseModel.prototype);

module.exports = new Rule();
