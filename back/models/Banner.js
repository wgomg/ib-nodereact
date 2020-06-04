'use strict';

const db = require('../db');

const logger = require('../libraries/logger');
const validate = require('../libraries/validate');
const cache = require('../libraries/cache');

const File = require('./File');

function Banner() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.name.toLowerCase() + '_id';

  this.procId = null;

  this.schema = {
    board_id: { type: 'table' },
    file_id: { type: 'table', required: true },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const images = Object.values(body.files).filter((file) => file.size > 0);
    File.procId = this.procId;
    const image = await File.save(images[0]);

    if (image.errors) return { errors: image.errors };

    delete body.files;

    body = {
      ...body,
      file_id: image.insertId,
      board_id: cache.getIdFromHash('Boards', body.board_id),
    };

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    let banner = await db.insert({ body, table: this.table });

    if (banner.insertId) banner = await this.find({ field: this.idField, value: banner.insertId });

    return banner;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedBanners = cache.getTable(this.table);
    if (cachedBanners.length > 0) return cachedBanners;

    let banners = await db.select({ table: this.table });
    if (banners.length > 0)
      banners = banners.map((banner) => {
        banner = {
          ...banner,
          board_id: banner.board_id ? cache.getHash('Boards', banner.board_id) : null,
          file_id: cache.getHash('Files', banner.file_id),
        };

        return banner;
      });
    cache.setTable(this.table, banners);

    return cache.getTable(this.table);
  };

  this.delete = async (banner_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: banner_id }, this.procId, 'method');

    const cachedId = cache.getIdFromHash(this.table, banner_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { banner: 'Invalid ID' } };

    const res = await db.remove({ id: { field: this.idField, value: cachedId }, table: this.table });

    if (res.affectedRows > 0) cache.removeFromTable(this.table, banner_id);

    return res;
  };

  this.find = async (filters) => {
    const cachedThreads = cache.getTableData(this.table, { ...filters });
    if (cachedThreads.length > 0) return cachedThreads;

    let banners = await db.select({ table: this.table, filters: [{ ...filters }] });

    if (banners.length > 0)
      banners.forEach((banner) => {
        cache.addTableData(this.table, {
          ...banner,
          board_id: banner.board_id ? cache.getHash('Boards', banner.board_id) : null,
          file_id: cache.getHash('Files', banner.file_id),
        });
      });

    return cache.getTableData(this.table, { ...filters });
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

module.exports = new Banner();
