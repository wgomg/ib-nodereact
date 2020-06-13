'use strict';

const db = require('../db');

const logger = require('../libraries/logger');
const cache = require('../libraries/cache');
const validate = require('../libraries/validate');

function Ban() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.name.toLowerCase() + '_id';

  this.procId = null;

  this.schema = {
    staff_id: { type: 'table', required: true },
    report_id: { type: 'table', required: true },
    user: { type: 'ipaddr', required: true },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    body = {
      ...body,
      staff_id: cache.getIdFromHash('Staffs', body.staff_id),
      report_id: cache.getIdFromHash('Reports', body.rule_id),
    };

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    const report = cache.getTableData('Reports', { field: 'report_id', value: body.report_id });
    if (report.errors) return { errors: report.errors };

    const rule = cache.getTableData('Rules', { field: 'hash', value: report[0].rule_id });
    if (rule.errors) return { errors: rule.errors };

    const banDuration = rule[0].duration;

    if (banDuration === 0) await db.insert({ body, table: this.table, ipField: 'user' });

    cache.setBannedAddress(body.user, banDuration);

    return true;
  };

  this.isUserBanned = async (user) => {
    logger.debug({ name: `${this.name}.isUserBanned()`, data: user }, this.procId, 'method');

    return cache.findBannedAddress(user);
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedBans = cache.getBannedList();
    if (cachedBans.length > 0) return cachedBans;

    let bans = await db.select({ table: this.table, ipField: 'user' });
    if (bans.length > 0)
      bans.forEach((ban) => {
        cache.setBannedAddress(ban.user);
      });

    return cache.getBannedList();
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'isUserBanned', 'getAll'];

    const functions = Object.entries(this)
      .filter(([key, val]) => typeof val === 'function' && !excluded.includes(key))
      .map(([fnName, fnDef]) => {
        const fnStr = fnDef.toString();
        const fnArgs = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(FN_ARGS);

        return { name: fnName, args: fnArgs };
      });

    return functions;
  };
}

module.exports = new Ban();
