'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const cache = require('../libraries/cache');

function Report() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.schema = {
    post_id: { type: 'table', required: true },
    rule_id: { type: 'table', required: true },
    solved: { type: 'bool' },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    body = { ...body, rule_id: cache.getIdFromHash('Rules', body.rule_id) };

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    let report = await db.insert({ body, table: this.table });

    if (report.insertId) {
      report = await db.select({
        table: this.table,
        filters: [{ field: this.idField, value: report.insertId }],
      });

      if (report.length > 0) {
        cache.addTableData(this.table, {
          ...report,
          rule_id: cache.getHash('Rules', report[0].rule_id),
        });
        report = cache.getTableData(this.table, { field: this.idField, value: report.insertId });
      }
    }

    return report;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedReports = cache.getTable(this.table);
    if (cachedReports.length > 0) return cachedReports;

    let reports = await db.rawQuery(
      'SELECT ' +
        'report_id, Reports.post_id, Boards.board_id, Reports.rule_id, solved, Reports.created_on ' +
        ' FROM Reports' +
        ' INNER JOIN Posts ON Posts.post_id = Reports.post_id' +
        ' INNER JOIN Threads ON Threads.thread_id = Posts.thread_id' +
        ' INNER JOIN Boards ON Boards.board_id = Threads.board_id'
    );

    if (reports.length > 0)
      reports = reports.map((report) => {
        report = {
          ...report,
          rule_id: cache.getHash('Rules', report.rule_id),
          board_id: cache.getHash('Boards', report.board_id),
        };

        return report;
      });
    cache.setTable(this.table, reports);

    return cache.getTable(this.table);
  };

  this.find = async (board_id) => {
    const cachedReports = cache.getTableData(this.table, { field: 'board_id', value: board_id });
    if (cachedReports.length > 0) return cachedReports;

    let reports = await db.rawQuery(
      'SELECT ' +
        'report_id, Reports.post_id, Boards.boards_id, Reports.rule_id, Rules.text, duration, solved, Reports.created_on ' +
        ' FROM Reports' +
        ' INNER JOIN Posts ON Posts.post_id = Reports.report_id' +
        ' INNER JOIN Threads ON Threads.thread_od = Posts.thread_od' +
        ' INNER JOIN Boards ON Boards.board_id = Threads.board_id' +
        ' WHERE Boards.board_id = ' +
        board_id
    );

    if (reports.length > 0)
      reports.forEach((report) => {
        report = {
          ...report,
          rule_id: cache.getHash('Rules', report.rule_id),
          board_id: cache.getHash('Boards', report.board_id),
        };

        cache.addTableData(this.table, report);
      });

    return cache.getTableData(this.table, { field: 'board_id', value: board_id });
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'getAll', 'find'];

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
