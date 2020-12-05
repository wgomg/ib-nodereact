'use strict';

const cache = require('../libraries/cache');

function Bans() {
  this.name = this.constructor.name;
  this.dbTable = this.name + 's';
  this.idField = this.name.toLowerCase() + '_id';

  this.schema = {
    post: {
      staff_id: { type: 'table', required: true },
      report_id: { type: 'table', required: true },
      ipaddress: { type: 'ipaddr', required: true },
      fingerprint: { type: 'string', required: true }
    },
    file: {
      staff_id: { type: 'table', required: true },
      report_id: { type: 'table', required: true },
      file_name: { type: 'alphanum', required: true }
    }
  };
}

Bans.prototype.isUserBanned = function (user) {
  return cache.findBannedUser(user);
};

Bans.prototype.get = function (filters = [], fields) {
  filters = filters.map((filter) => {
    if (filter.value && filter.field.includes('_id')) {
      const model =
        filter.field.slice(0, 1).toUpperCase() +
        filter.field.slice(1, filter.field.length - 3) +
        's';
      const Model = new (require('./' + model))();

      filter.value = parseInt(Model.getEntryId(filter.value));
    }

    return filter;
  });

  return cache.getTable(this.dbTable, filters, fields);
};

module.exports = Bans;
