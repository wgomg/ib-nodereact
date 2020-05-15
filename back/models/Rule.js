'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

function Rule() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.schema = {
    board_id: { type: 'table' },
    text: { type: 'alphanum', length: 45, required: true },
    duration: { type: 'num', required: true },
    details: { type: 'string', length: 250 },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema);
    if (errors) return { validationError: errors };

    let rule = await db.insert({ body, table: this.table }, this.procId);

    if (rule.insertId) {
      rule = await db.select({
        table: this.table,
        filters: [{ field: this.idField, value: rule.insertId }],
      });
    }

    return rule;
  };

  this.update = (body) => {
    logger.debug({ name: `${this.name}.update()`, data: body }, this.procId, 'method');

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { validationError: errors };

    return db.update(
      { body, table: this.table, id: { field: this.idField, value: idValue } },
      this.procId
    );
  };

  this.gBoard = async (board_id) => {
    logger.debug({ name: `${this.name}.get()` }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(board_id)) return { validationError: 'Invalid ID' };

    return db.select(
      { table: this.table, filters: [{ field: 'board_id', value: board_id }] },
      this.procId
    );
  };

  this.getGlobal = async () => {
    logger.debug({ name: `${this.name}.getGlobal()` }, this.procId, 'method');

    return await db.select(
      { table: this.table, filters: [{ field: 'board_id', value: null }] },
      this.procId
    );
  };

  this.delete = (rule_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: rule_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(rule_id)) return { validationError: 'Invalid ID' };

    return db.remove({ id: { field: this.idField, value: rule_id }, table: this.table }, this.procId);
  };

  this.getBoardId = async (rule_id) => {
    logger.debug({ name: `${this.name}.getBoardId()`, data: rule_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(rule_id)) return { validationError: 'Invalid ID' };

    const rule = await db.select(
      { table: this.table, filters: [{ field: this.idField, value: rule_id }] },
      this.procId
    );

    if (rule.length === 0) return null;

    return rule[0].board_id;
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'getBoardId'];

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
