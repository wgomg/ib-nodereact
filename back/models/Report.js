'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const Rule = require('./Rule');

function Report() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.schema = {
    post_id: { type: 'table', required: true },
    rule_id: { type: 'table', required: true },
    text: { type: 'alphanum', length: 45, required: true },
    details: { type: 'string', length: 250 },
    solved: { type: 'bool' },
  };

  this.save = (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId);

    const errors = validate(body, this.schema);
    if (errors) return { validationError: errors };

    return db.insert({ body, table: this.table }, this.procId);
  };

  this.updateSolved = (report_id) => {
    logger.debug({ name: `{this.name}.setAsSolved()`, data: report_id }, this.procId);

    if (!/^[0-9]+$/i.test(report_id)) return { validationError: 'Invalid ID' };

    return db.update(
      {
        body: { solved: true },
        table: this.table,
        id: { field: this.idField, value: report_id },
      },
      this.procId
    );
  };

  this.getAll = () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    return db.select({ table: this.table }, this.procId);
  };

  this.getBoardId = async (report_id) => {
    logger.debug({ name: `${this.name}.getBoard()`, data: report_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(report_id)) return { validationError: 'Invalid ID' };

    const report = await db.select(
      { table: this.table, filters: [{ [this.idField]: report_id }] },
      this.procId
    );

    if (report.length === 0) return null;

    return Rule.getBoardId(report.rule_id);
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

module.exports = new Report();
