'use strict';

const BaseModel = require('./BaseModel');

function Ban() {
  const classname = 'ban';

  const schema = {
    ban_id: { pk: true },
    staff_id: { type: 'table', required: true },
    post_id: { type: 'table', required: true, ip_field: 'user' },
    rule_id: { type: 'table', required: true },
    comment: { type: 'alphanum', length: 45, required: true }
  };

  BaseModel.call(this, classname, schema);
}

Ban.prototype = Object.create(BaseModel.prototype);

Ban.prototype.getByUser = function(user, callback) {
  BaseModel.prototype.getEntry.call(this, [{ 'Posts.user': `INET6_ATON('${user}')` }], (err, res) =>
    callback(err, res)
  );
};

module.exports = new Ban();
