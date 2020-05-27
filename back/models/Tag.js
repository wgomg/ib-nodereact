'use strict';

const db = require('../db');
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
    name: { type: 'alpha', length: 10, minLength: 2, required: true },
    op_replacer: { type: 'string', length: 50, required: true },
    cl_replacer: { type: 'string', length: 50, required: true },
    css: { type: 'css', length: 250 },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    const tag = await db.insert({ body, table: this.table }, this.procId);

    if (tag.insertId) {
      return db.select(
        { table: this.table, filters: [{ field: this.idField, value: tag.insertId }] },
        this.procId
      );
    }

    return tag;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    let tags = await db.select({ table: this.table }, this.procId);

    if (tags.length > 0)
      tags = tags.map((tag) => {
        tag.tag_id = cache.setHashId(this.table, tag.tag_id, 'dbData');

        return tag;
      });

    return tags;
  };

  this.delete = (tag_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: tag_id }, this.procId, 'method');

    const cachedId = cache.getKeyInObject(this.table, tag_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { board: 'Invalid ID' } };

    return db.remove({ id: { field: this.idField, value: cachedId }, table: this.table }, this.procId);
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
