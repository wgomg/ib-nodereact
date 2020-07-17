'use strict';

const db = require('../libraries/db');
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
          ...report[0],
          rule_id: cache.getHash('Rules', report[0].rule_id),
        });
        report = cache.getTableData(this.table, { field: this.idField, value: report.insertId });
      }
    }

    return report;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const Post = require('./Post');
    Post.procId = this.procId;

    let cachedReports = cache.getTable(this.table);

    if (cachedReports.length > 0) {
      cachedReports = await Promise.all(
        cachedReports
          .filter(async (report) => {
            const rule = cache.getTableData('Rules', { field: 'hash', value: report.rule_id });
            if (cache.getPostUser(report.post_id) || rule[0].apply_on === 'file') return true;

            this.updateSolved({ report_id: report.report_id });

            return false;
          })
          .map(async (report) => {
            const post = await Post.get(report.post_id);
            const rule = cache.getTableData('Rules', { field: 'hash', value: report.rule_id });

            report = {
              ...report,
              post: post.length > 0 ? post[0] : {},
              rule: rule[0],
            };

            delete report.rule_id;
            delete report.post_id;

            return report;
          })
      );

      return cachedReports;
    }

    let reports = await db.rawQuery(
      'SELECT ' +
        'report_id, Reports.post_id, Boards.board_id, Reports.rule_id, solved, Reports.created_on ' +
        ' FROM Reports' +
        ' INNER JOIN Posts ON Posts.post_id = Reports.post_id' +
        ' INNER JOIN Threads ON Threads.thread_id = Posts.thread_id' +
        ' INNER JOIN Boards ON Boards.board_id = Threads.board_id' +
        ' WHERE solved = 0'
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
    reports = cache.getTable(this.table);

    reports = await Promise.all(
      reports.map(async (report) => {
        const post = await Post.get(report.post_id);
        const rule = cache.getTableData('Rules', { field: 'hash', value: report.rule_id });

        report = {
          ...report,
          post: post.length > 0 ? post[0] : {},
          rule: rule[0],
        };

        delete report.rule_id;
        delete report.post_id;

        return report;
      })
    );

    return reports;
  };

  this.updateSolved = async (body) => {
    const cachedId = cache.getIdFromHash(this.table, body.report_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { report: 'Invalid ID' } };

    const res = await db.update({
      table: this.table,
      body: { solved: 1 },
      id: { field: this.idField, value: cachedId },
    });

    if (res.changedRows > 0) cache.removeFromTable(this.table, body.report_id);

    return res;
  };

  this.find = async (filters) => {
    let cachedReports = [];

    const Post = require('./Post');
    Post.procId = this.procId;

    filters.forEach((filter) => {
      const cached = cache.getTableData(this.table, { ...filter });

      cached.forEach((report) => {
        cachedReports.push(report);
      });
    });

    if (cachedReports.length > 0) {
      cachedReports = await Promise.all(
        cachedReports
          .filter(async (report) => {
            if (cache.getPostUser(report.post_id)) return true;

            this.updateSolved({ report_id: report.report_id });

            return false;
          })
          .map(async (report) => {
            const post = await Post.get(report.post_id);
            const rule = cache.getTableData('Rules', { field: 'hash', value: report.rule_id });

            report = {
              ...report,
              post: post.length > 0 ? post[0] : {},
              rule: rule[0],
            };

            delete report.rule_id;
            delete report.post_id;

            return report;
          })
      );

      return cachedReports;
    }

    let sql =
      'SELECT ' +
      'report_id, Reports.post_id, Boards.board_id, Reports.rule_id, solved, Reports.created_on ' +
      ' FROM Reports' +
      ' INNER JOIN Posts ON Posts.post_id = Reports.report_id' +
      ' INNER JOIN Threads ON Threads.thread_id = Posts.thread_id' +
      ' INNER JOIN Boards ON Boards.board_id = Threads.board_id' +
      ' WHERE ';

    sql += filters.map((filter) => `Boards.${filter.field} = ${filter.value}`).join(' OR ');

    let reports = await db.rawQuery(sql);

    if (reports.length > 0)
      reports.forEach((report) => {
        report = {
          ...report,
          rule_id: cache.getHash('Rules', report.rule_id),
          board_id: cache.getHash('Boards', report.board_id),
        };

        cache.addTableData(this.table, report);
      });

    reports = cache.getTableData(this.table, { ...filters });

    reports = await Promise.all(
      reports.map(async (report) => {
        const post = await Post.get(report.post_id);
        const rule = cache.getTableData('Rules', { field: 'hash', value: report.rule_id });

        report = {
          ...report,
          post: post.length > 0 ? post[0] : {},
          rule: rule[0],
        };

        delete report.rule_id;
        delete report.post_id;

        return report;
      })
    );

    return reports;
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

module.exports = new Report();
