'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const Post = require('./Post');

function Ban() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().replace('s', '_id');

  this.procId = null;

  this.schema = {
    staff_id: { type: 'table', required: true },
    post_id: { type: 'table', required: true },
    rule_id: { type: 'table', required: true },
    user: { type: 'ipaddr', required: true },
    comment: { type: 'alphanum', length: 45, required: true },
  };

  this.save = (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema);
    if (errors) return { validationError: errors };

    return db.insert({ body, table: this.table, ipField: 'user' }, this.procId);
  };

  this.getBoardId = async (ban_id) => {
    logger.debug({ name: `${this.name}.getBoard()`, data: ban_id }, this.procId, 'method');

    const ban = await db.select(
      {
        table: this.table,
        filters: [{ field: this.idField, value: ban_id }],
      },
      this.procId
    );

    if (ban.length === 0) return null;

    return Post.getBoardId(ban.post_id);
  };

  this.isUserBanned = async (user) => {
    logger.debug({ name: `${this.name}.isUserBanned()`, data: user }, this.procId, 'method');

    const ban = await db.select(
      {
        table: this.table,
        filters: [{ field: 'user', value: user }],
        ipField: 'user',
      },
      this.procId
    );

    return ban.length > 0;
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'getBoardId', 'isUserBanned'];

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
