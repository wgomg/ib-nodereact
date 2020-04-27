'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const File = require('./File');

function Banner() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().replace('s', '_id');

  this.procId = null;

  this.schema = {
    board_id: { type: 'table' },
    file_id: { type: 'table', required: true },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const images = Object.values(body.files).filter((file) => file.size > 0);
    const image = await File.save(images[0]);
    delete body.files;

    const newBanner = { ...body, file_id: !image ? null : image[0].insertId };

    const errors = validate(newBanner, this.schema);
    if (errors) return { validationError: errors };

    return db.insert({ newBanner, table: this.table }, this.procId);
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    let res = await db.select({ table: this.table }, this.procId);

    if (res.length > 0)
      res = res.map((r) => ({
        [this.idField]: r[this.idField],
        contentType: 'image/' + path.extname(r.uri).replace('.', ''),
        uri: r.uri,
        name: r.name,
        size: r.size,
      }));

    return res;
  };

  this.delete = (banner_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: banner_id }, this.procId, 'method');

    return db.remove({ id: { field: this.idField, value: banner_id }, table: this.table }, this.procId);
  };

  this.getBoardId = async (banner_id) => {
    logger.debug({ name: `${this.name}.getBoard()`, data: banner_id }, this.procId, 'method');

    const banner = await db.select(
      { table: this.table, filters: [{ [this.idField]: banner_id }] },
      this.procId
    );

    if (banner.length === 0) return null;

    return banner[0].board_id;
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

module.exports = new Banner();
