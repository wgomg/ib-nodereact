'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const cache = require('../libraries/cache');

function Rule() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.schema = {
    board_id: { type: 'table' },
    text: { type: 'alphanum', length: 45, required: true },
    ban_duration: { type: 'num', required: true },
    apply_on: { type: 'list|post,file', required: true },
    details: { type: 'string', length: 250 },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    body = {
      ...body,
      board_id: body.board_id ? cache.getIdFromHash('Boards', body.board_id) : null,
    };

    let rule = await db.insert({ body, table: this.table }, this.procId);

    if (rule.insertId) {
      rule = await db.select({
        table: this.table,
        filters: [{ field: this.idField, value: rule.insertId }],
      });

      if (rule.length > 0) {
        cache.addTableData(this.table, {
          ...rule[0],
          board_id: rule[0].board_id ? cache.getIdFromHash('Boards', rule[0].board_id) : null,
        });

        rule = cache.getTableData(this.table, { field: this.idField, value: rule[0].rule_id });
      }
    }

    return rule;
  };

  this.update = async (body) => {
    logger.debug({ name: `${this.name}.update()`, data: body }, this.procId, 'method');

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    const cachedId = cache.getIdFromHash(this.table, idValue);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { rule: 'Invalid ID' } };

    let rule = await db.update({
      body,
      table: this.table,
      id: { field: this.idField, value: cachedId },
    });

    if (rule.changedRows > 0) {
      cache.updateTableData(this.table, { ...body, [this.idField]: cachedId });
      rule = cache.getTableData(this.table, { field: this.idField, value: cachedId });
    }

    return rule;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedRules = cache.getTable(this.table);
    if (cachedRules.length > 0) return cachedRules;

    let rules = await db.select({ table: this.table });

    if (rules.length > 0)
      rules = rules.map((rule) => ({
        ...rule,
        board_id: rule.board_id ? cache.getHash('Boards', rule.board_id) : null,
      }));

    cache.setTable(this.table, rules);

    return cache.getTable(this.table);
  };

  this.delete = async (rule_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: rule_id }, this.procId, 'method');

    const cachedId = cache.getIdFromHash(this.table, rule_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { rule: 'Invalid ID' } };

    const res = await db.remove({ id: { field: this.idField, value: cachedId }, table: this.table });

    if (res.affectedRows > 0) cache.removeFromTable(this.table, rule_id);

    return res;
  };

  this.find = async (filters) => {
    let cachedRules = [];

    filters.forEach((filter) => {
      const cached = cache.getTableData(this.table, { ...filter });

      cached.forEach((rule) => {
        cachedRules.push(rule);
      });
    });

    if (cachedRules.length > 0) return cachedRules;

    let rules = await db.select({ table: this.table, filters });

    if (rules.length > 0)
      rules.forEach((rule) => {
        rule = { ...rule, board_id: cache.getHash('Boards', rule.board_id) };
        cache.addTableData(this.table, rule);
      });

    return cache.getTableData(this.table, { ...filters });
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'find'];

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

module.exports = new Rule();
