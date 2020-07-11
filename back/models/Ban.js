'use strict';

const logger = require('../libraries/logger');
const cache = require('../libraries/cache');
const validate = require('../libraries/validate');

const VANISHED_FILE_ID = 1;

function Ban() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.name.toLowerCase() + '_id';

  this.procId = null;

  this.schema = {
    post: {
      staff_id: { type: 'table', required: true },
      report_id: { type: 'table', required: true },
      ipaddress: { type: 'ipaddr', required: true },
      fingerprint: { type: 'string', required: true },
    },
    file: {
      staff_id: { type: 'table', required: true },
      report_id: { type: 'table', required: true },
      file_name: { type: 'alphanum', required: true },
    },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const report = cache.getTableData('Reports', { field: 'hash', value: body.report_id });
    if (report.errors) return { errors: report.errors };
    if (report.length === 0) return false;

    const user = cache.getPostUser(report[0].post_id);

    if (!user) return false;

    const rule = cache.getTableData('Rules', { field: 'hash', value: report[0].rule_id });
    if (rule.errors) return { errors: rule.errors };
    if (rule.length === 0) return false;

    let schema = this.schema.post;

    body = {
      ...body,
      staff_id: cache.getIdFromHash('Staffs', body.staff_id),
      report_id: cache.getIdFromHash('Reports', body.report_id),
      ...user,
    };

    if (rule[0].apply_on === 'file') {
      const post = cache.getTableData('Posts', { field: 'post_id', value: report[0].post_id });
      const file = cache.getTableData('Files', { field: 'hash', value: post[0].file.file_id });

      body = {
        staff_id: body.staff_id,
        report_id: body.report_id,
        file_name: file[0].name,
      };

      schema = this.schema.file;
    }

    const errors = validate(body, schema);
    if (errors) return { errors };

    const banDuration = rule[0].ban_duration;

    if (rule[0].apply_on === 'post') cache.setBannedUser(user, banDuration);
    else if (rule[0].apply_on === 'file') {
      const post = cache.getTableData('Posts', { field: 'post_id', value: report[0].post_id });

      const fileToBeDeleted = post[0].file.file_id;

      const Post = require('./Post');
      Post.procId = this.procId;
      Post.schema.text.required = false;

      Post.update({ post_id: post[0].post_id, file_id: VANISHED_FILE_ID });

      const fileToBeBanned = cache.getTableData('Files', { field: 'hash', value: fileToBeDeleted });

      cache.setBannedFile(fileToBeBanned[0].name, banDuration);
      const File = require('./File');
      File.procId = this.procId;
      File.delete(fileToBeDeleted);
    }

    const Report = require('./Report');
    Report.procId = this.procId;

    await Report.updateSolved({ report_id: report[0].report_id });

    return true;
  };

  this.isUserBanned = async (user) => {
    logger.debug({ name: `${this.name}.isUserBanned()`, data: user }, this.procId, 'method');

    return cache.findBannedUser(user);
  };

  this.isFileBanned = async (fileMd5) => {
    logger.debug({ name: `${this.name}.isFileBanned()`, data: fileMd5 }, this.procId, 'method');

    return cache.findBannedFile(fileMd5);
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'isUserBanned', 'isFileBanned'];

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
