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
    File.genThumb = false;
    const image = await File.save(images[0]);

    if (image.errors) return { errors: image.errors };

    delete body.files;

    body = {
      ...body,
      file_id: cache.getIdFromHash('Files', image.file_id),
      board_id: cache.getIdFromHash('Boards', body.board_id),
    };

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    let banner = await db.insert({ body, table: this.table });

    if (banner.insertId) {
      banner = await db.select({
        table: this.table,
        filters: [{ field: this.idField, value: banner.insertId }],
      });

      if (banner.length > 0) {
        let toCacheBanner = {
          ...banner[0],
          board_id: banner[0].board_id ? cache.getHash('Boards', banner[0].board_id) : null,
          image: await File.get(banner[0].file_id),
        };
        delete toCacheBanner.file_id;
        cache.addTableData(this.table, toCacheBanner);

        banner = cache.getTableData(this.table, { field: this.idField, value: banner[0].banner_id });
      }
    }

    return banner;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedBanners = cache.getTable(this.table);
    if (cachedBanners.length > 0) return cachedBanners;

    let banners = await db.select({ table: this.table });
    if (banners.length > 0)
      banners = await Promise.all(
        banners.map(async (banner) => {
          banner = {
            ...banner,
            board_id: banner.board_id ? cache.getHash('Boards', banner.board_id) : null,
            image: await File.get(banner.file_id),
          };

          delete banner.file_id;

          return banner;
        })
      );
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
    let cachedBanners = [];

    filters.forEach((filter) => {
      const cached = cache.getTableData(this.table, { ...filter });

      cached.forEach((banner) => {
        cachedBanners.push(banner);
      });
    });

    if (cachedBanners.length > 0) return cachedBanners;

    let banners = await db.select({ table: this.table, filters });

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

  this.get = async (banner_id) => {
    const cachedBanners = cache.getTableData(this.table, { field: this.idField, value: banner_id });
    if (cachedBanners.length > 0) return;
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'find', 'get'];

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
