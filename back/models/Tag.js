'use strict';

const db = require('../libraries/db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const cache = require('../libraries/cache');

function Tag() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.schema = {
    tag: { type: 'tag', length: 3, required: true },
    name: { type: 'alpha', length: 10, minLength: 2, required: true, unique: true },
    op_replacer: { type: 'string', length: 50, required: true, unique: true },
    cl_replacer: { type: 'string', length: 50, required: true },
    css: { type: 'css', length: 250 },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema, this.table);
    if (errors) return { errors };

    let tag = await db.insert({ body, table: this.table }, this.procId);

    if (tag.insertId) {
      tag = await db.select({
        table: this.table,
        filters: [{ field: this.idField, value: tag.insertId }],
      });

      if (tag.length > 0) cache.addTableData(this.table, tag[0]);

      tag = cache.getTableData(this.table, { field: this.idField, value: tag[0].tag_id });
    }

    return tag;
  };

  this.update = async (body) => {
    logger.debug({ name: `${this.name}.update()`, data: body }, this.procId, 'method');

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema, this.table);
    if (errors) return { errors };

    const cachedId = cache.getIdFromHash(this.table, idValue);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { tag: 'Invalid ID' } };

    let tag = await db.update({
      body,
      table: this.table,
      id: { field: this.idField, value: cachedId },
    });

    if (tag.changedRows > 0) {
      cache.updateTableData(this.table, { ...body, [this.idField]: cachedId });
      tag = cache.getTableData(this.table, { field: this.idField, value: cachedId });
    }

    return tag;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedTags = cache.getTable(this.table);
    if (cachedTags.length > 0) return cachedTags;

    let tags = await db.select({ table: this.table });
    cache.setTable(this.table, tags);

    return cache.getTable(this.table);
  };

  this.delete = async (tag_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: tag_id }, this.procId, 'method');

    const cachedId = cache.getIdFromHash(this.table, tag_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { rule: 'Invalid ID' } };

    const res = await db.remove({ id: { field: this.idField, value: cachedId }, table: this.table });

    if (res.affectedRows > 0) cache.removeFromTable(this.table, tag_id);

    return res;
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions'];

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

module.exports = new Tag();
