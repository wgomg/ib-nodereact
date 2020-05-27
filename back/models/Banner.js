'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const cache = require('../libraries/cache');

const File = require('./File');
const Board = require('./Board');

function Banner() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

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
    delete body.files;

    let newBanner = { ...body };
    if (image.errors) return { errors: image.errors };

    newBanner.file_id = !image ? null : image.insertId;

    const errors = validate(newBanner, this.schema);
    if (errors) return { errors };

    newBanner = await db.insert({ body: newBanner, table: this.table }, this.procId);

    if (newBanner.insertId) {
      let banner = await db.select(
        {
          table: this.table,
          filters: [{ field: this.idField, value: newBanner.insertId }],
        },
        this.procId
      );

      if (banner.length > 0) {
        if (banner[0].file_id) {
          File.procId = this.procId;
          const image = await File.getByID(banner[0].file_id);
          banner[0].image = image.length === 0 ? null : image[0];
          delete banner[0].file_id;
        }

        if (banner[0].board_id) {
          Board.procId = this.procId;
          const board = await Board.getByID(banner[0].board_id);
          banner[0].board = board.length === 0 ? null : board[0];
          delete banner[0].board_id;
        }
      }

      return banner;
    }

    return newBanner;
  };

  this.get = async (board_id) => {
    logger.debug({ name: `${this.name}.get()` }, this.procId, 'method');

    const cachedId = cache.getKeyInObject('Boards', board_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { board: 'Invalid ID' } };

    let banners = await db.select(
      { table: this.table, filters: [{ field: 'board_id', value: cachedId }] },
      this.procId
    );

    if (banners.length > 0) {
      return Promise.all(
        banners.map(async (banner) => {
          if (banner.file_id) {
            File.procId = this.procId;
            const image = await File.getByID(banner.file_id);
            banner.image = image.length === 0 ? null : image[0];
            delete banner.file_id;
          }

          if (banner.board_id) {
            Board.procId = this.procId;
            const board = await Board.getByID(banner.board_id);
            banner.board = board.length === 0 ? null : board[0];
            delete banner.board_id;
          }

          banner.banner_id = cache.setHashId(this.table, banner.banner_id, 'dbData');

          return banner;
        })
      );
    }

    return banners;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    let banners = await db.select({ table: this.table }, this.procId);

    if (banners.length > 0)
      return Promise.all(
        banners.map(async (banner) => {
          if (banner.file_id) {
            File.procId = this.procId;
            const image = await File.getByID(banner.file_id);
            banner.image = image.length === 0 ? null : image[0];
            delete banner.file_id;
          }

          if (banner.board_id) {
            Board.procId = this.procId;
            const board = await Board.getByID(banner.board_id);
            banner.board = board.length === 0 ? null : board[0];
            delete banner.board_id;
          }

          banner.banner_id = cache.setHashId(this.table, banner.banner_id, 'dbData');

          return banner;
        })
      );

    return banners;
  };

  this.delete = (banner_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: banner_id }, this.procId, 'method');

    const cachedId = cache.getKeyInObject(this.table, banner_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { board: 'Invalid ID' } };

    return db.remove({ id: { field: this.idField, value: cachedId }, table: this.table }, this.procId);
  };

  this.getBoardId = async (banner_id) => {
    logger.debug({ name: `${this.name}.getBoard()`, data: banner_id }, this.procId, 'method');

    const cachedId = cache.getKeyInObject(this.table, banner_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { board: 'Invalid ID' } };

    const banner = await db.select(
      { table: this.table, filters: [{ [this.idField]: cachedId }] },
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
