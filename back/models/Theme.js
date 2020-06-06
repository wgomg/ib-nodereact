'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const cache = require('../libraries/cache');

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
    if (errors) return { errors };

    let theme = await db.insert({ body, table: this.table }, this.procId);

    if (theme.insertId) {
      theme = await db.select({
        table: this.table,
        filters: [{ field: this.idField, value: tag.insertId }],
      });

      if (theme.length > 0) cache.addTableData(this.table, theme[0]);

      theme = cache.getTableData(this.table, { field: this.idField, value: theme[0].theme_id });
    }

    return tag;
  };

  this.get = async (name) => {
    logger.debug({ name: `${this.name}.get()` }, this.procId, 'method');

    const cachedTheme = cache.getTableData(this.table, { field: 'name', value: name });
    if (cachedTheme.length > 0) return cachedTheme;

    const theme = await db.select({ table: this.table, filters: [{ field: 'name', value: name }] });
    if (theme.length > 0) cache.addTableData(this.table, theme[0]);

    return cache.getTableData(this.table, { field: 'name', value: name });
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedThemes = cache.getTable(this.table);
    if (cachedThemes.length > 0) return cachedThemes;

    let themes = await db.select({ table: this.table });
    cache.setTable(this.table, themes);

    return cache.getTable(this.table);
  };

  this.delete = async (theme_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: theme_id }, this.procId, 'method');

    const cachedId = cache.getIdFromHash(this.table, theme_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { theme: 'Invalid ID' } };

    const res = await db.remove({ id: { field: this.idField, value: cachedId }, table: this.table });

    if (res.affectedRows > 0) cache.removeFromTable(this.table, theme_id);

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
