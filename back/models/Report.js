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
    solved: { type: 'bool' },
  };

  this.save = (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema);
    if (errors) return { validationError: errors };

    return db.insert({ body, table: this.table }, this.procId);
  };

  this.updateSolved = (report_id) => {
    logger.debug({ name: `{this.name}.setAsSolved()`, data: report_id }, this.procId, 'method');

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

  this.gBoard = async (board_id) => {
    logger.debug({ name: `${this.name}.gBoard()` }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(board_id)) return { validationError: 'Invalid ID' };

    const sql =
      'SELECT ' +
      'report_id, Reports.post_id, Boards.uri, Reports.rule_id, Rules.text, duration, solved, Reports.created_on ' +
      ' FROM Reports' +
      ' INNER JOIN Rules ON Reports.rule_id = Rules.rule_id' +
      ' INNER JOIN Boards ON Rules.board_id = Boards.board_id' +
      ' WHERE Rules.board_id = ' +
      board_id;

    const reports = await db.rawQuery(sql, this.procId);

    if (reports.length > 0) {
      const Post = require('./Post');
      Post.procId = this.procId;

      return await Promise.all(
        reports.map(async (report) => {
          report.post = await Post.get(report.post_id);
          delete report.post_id;

          return report;
        })
      );
    }

    return reports;
  };

  this.getGlobal = async () => {
    logger.debug({ name: `${this.name}.getGlobal()` }, this.procId, 'method');

    const sql =
      'SELECT ' +
      'report_id, Reports.post_id, Boards.uri, Reports.rule_id, Rules.text, duration, solved, Reports.created_on ' +
      ' FROM Reports' +
      ' INNER JOIN Rules ON Reports.rule_id = Rules.rule_id' +
      ' INNER JOIN Posts ON Reports.post_id = Posts.post_id' +
      ' INNER JOIN Threads ON Posts.thread_id = Threads.thread_id' +
      ' INNER JOIN Boards ON Threads.board_id = Boards.board_id' +
      ' WHERE Rules.board_id IS NULL';

    const reports = await db.rawQuery(sql, this.procId);

    if (reports.length > 0) {
      const Post = require('./Post');
      Post.procId = this.procId;

      return await Promise.all(
        reports.map(async (report) => {
          report.post = await Post.get(report.post_id);
          delete report.post_id;

          return report;
        })
      );
    }

    return reports;
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
