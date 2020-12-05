'use strict';

const BaseModel = require('./BaseModel');

function Reports() {
  BaseModel.call(this, {
    post_id: { type: 'table', required: true },
    board_id: { type: 'table', required: true },
    rule_id: { type: 'table', required: true },
    solved: { type: 'bool' }
  });
}

Reports.prototype = Object.create(BaseModel.prototype);
Reports.prototype.constructor = Reports;

module.exports = Reports;
