'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const Tag = require('./Tag');

function Theme() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.schema = {
    name: { type: 'alpha', length: 10, minLength: 2, required: true },
    css: { type: 'css', length: 10000, required: true },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema);
    if (errors) return { validationError: errors };

    const theme = await db.insert({ body, table: this.table }, this.procId);

    if (theme.insertId)
      return db.select({ table: this.table, filters: [{ field: this.idField, value: theme.insertId }] });

    return theme;
  };

  this.get = async (name) => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    let res = await db.select(
      { table: this.table, filters: [{ field: 'name', value: name }] },
      this.procId
    );

    if (res.length > 0) {
      Tag.procId = this.procId;
      const tags = await Tag.getAll();

      if (tags.length > 0) res[0].css += tags.map((tag) => tag.css).join(' ');
    }

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

module.exports = new Theme();
