'use strict';

const BaseModel = require('./BaseModel');

function Report() {
  const classname = 'report';

  const schema = {
    report_id: { pk: true },
    post_id: { type: 'table', required: true },
    rule_id: { type: 'table', required: true },
    text: { type: 'alphanum', length: 45, required: true },
    details: { type: 'string', length: 250 },
    solved: { type: 'bool' }
  };

  BaseModel.call(this, classname, schema);
}

Report.prototype = Object.create(BaseModel.prototype);

module.exports = new Report();
