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

    const theme = await db.insert({ body, table: this.table }, this.procId);

    if (theme.insertId)
      return db.select({ table: this.table, filters: [{ field: this.idField, value: theme.insertId }] });

    return theme;
  };

  this.update = async (body) => {
    logger.debug({ name: `${this.name}.update()`, data: body }, this.procId, 'method');

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    const cachedId = cache.getKeyInObject(this.table, idValue);

    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { theme: 'Invalid ID' } };

    let res = await db.update(
      { body, table: this.table, id: { field: this.idField, value: cachedId } },
      this.procId
    );

    if (res.affectedRows > 0) {
      res = await db.select({ table: this.table, filters: [{ field: this.idField, value: cachedId }] });

      res[0].theme_id = cache.setHashId(this.table, res[0].theme_id, 'dbData');
    }

    return res;
  };

  this.get = async (name) => {
    logger.debug({ name: `${this.name}.get()` }, this.procId, 'method');

    const theme = await db.select(
      { table: this.table, filters: [{ field: 'name', value: name }] },
      this.procId
    );

    if (theme.length > 0) theme[0].theme_id = cache.setHashId(this.table, theme[0].theme_id, 'dbData');

    return theme;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    let themes = await db.select({ table: this.table }, this.procId);

    if (themes.length > 0)
      themes = themes.map((theme) => {
        theme.theme_id = cache.setHashId(this.table, theme.theme_id, 'dbData');

        return theme;
      });

    return themes;
  };

  this.delete = (theme_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: theme_id }, this.procId, 'method');

    const cachedId = cache.getKeyInObject(this.table, theme_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { theme: 'Invalid ID' } };

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

module.exports = new Theme();
