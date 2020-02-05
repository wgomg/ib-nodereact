'use strict';

const BaseModel = require('./BaseModel');

// Constructor
function Complaint() {
  const classname = 'complaints';

  const schema = {
    ban_id: { pk: true },
    staff_id: { type: 'table', required: true },
    defendant: { type: 'alpha', length: 15, required: true },
    comment: { type: 'alphanum', length: 45 },
    resolved: { type: 'bool' }
  };

  BaseModel.call(this, classname, schema);
}

Complaint.prototype = Object.create(BaseModel.prototype);

module.exports = new Complaint();
