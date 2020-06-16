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
    ipaddress: { type: 'ipaddr', required: true },
    fingerprint: { type: 'string', required: true },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const report = cache.getTableData('Reports', { field: 'hash', value: body.report_id });
    if (report.errors) return { errors: report.errors };

    if (report.length === 0) return false;

    const user = cache.getPostUser(report[0].post_id);

    if (!user) return false;

    body = {
      ...body,
      staff_id: cache.getIdFromHash('Staffs', body.staff_id),
      report_id: cache.getIdFromHash('Reports', body.report_id),
      ...user,
    };

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    const rule = cache.getTableData('Rules', { field: 'hash', value: report[0].rule_id });
    if (rule.errors) return { errors: rule.errors };

    const banDuration = rule[0].ban_duration;

    if (banDuration === 0) await db.insert({ body, table: this.table, ipField: 'ipaddress' });

    cache.setBannedUser(user, banDuration);
    const Report = require('./Report');
    Report.procId = this.procId;

    await Report.updateSolved({ report_id: report[0].report_id });

    return true;
  };

  this.isUserBanned = async (user) => {
    logger.debug({ name: `${this.name}.isUserBanned()`, data: user }, this.procId, 'method');

    return cache.findBannedUser(user);
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedBans = cache.getBannedList();
    if (cachedBans.length > 0) return cachedBans;

    let bans = await db.select({ table: this.table, ipField: 'user' });
    if (bans.length > 0)
      bans.forEach((ban) => {
        cache.setBannedUser(ban.user);
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
