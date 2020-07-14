'use strict';

const db = require('../db');

const logger = require('../libraries/logger');
const validate = require('../libraries/validate');
const thumb = require('../libraries/thumb');
const cache = require('../libraries/cache');

const AllowedFile = require('../libraries/AllowedFile');

const config = require('../config').files;

const fs = require('fs');

function File() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.genThumb = true;

  this.schema = {
    mimetype: { type: 'string', length: 45, required: true },
    name: { type: 'alphanum', length: 50, required: true },
    extension: { type: 'ext', length: 4, required: true },
    size: { type: 'num', required: true },
    folder: { type: 'dir', length: 20, required: true },
  };

  this.save = async (file) => {
    logger.debug({ name: `${this.name}.save()`, data: file }, this.procId, 'method');

    const cachedFile = cache.getTableData(this.table, { field: 'name', value: file.md5 });
    if (cachedFile.length > 0) return cachedFile[0];

    const allowed = new AllowedFile(file);

    if (allowed.error) return { errors: { file: allowed.error } };

    const errors = validate(allowed.schemaData, this.schema);
    if (errors) return { errors };

    await allowed.saveToDisk();
    if (this.genThumb) await allowed.generateThumb();

    if (allowed.error) return { errors: { file: allowed.error } };

    file = await db.insert({ body: allowed.schemaData, table: this.table });

    if (file.insertId) {
      file = await db.select({
        table: this.table,
        filters: [{ field: this.idField, value: file.insertId }],
      });

      if (file.length > 0) file = this.get(file[0].file_id);
    }

    return file;
  };

  this.get = async (file_id) => {
    if (!/^[0-9]+$/i.test(file_id)) return { errors: { file: 'Invalid ID' } };

    const cachedFile = cache.getTableData(this.table, { field: this.idField, value: file_id });

    if (cachedFile.length > 0) return cachedFile[0];

    let file = await db.select({
      table: this.table,
      filters: [{ field: this.idField, value: file_id }],
    });

    if (file.length > 0) {
      file = file[0];
      file.thumb = await thumb.get(file.name, file.extension, file.folder);

      cache.addTableData(this.table, file);
      file = cache.getTableData(this.table, { field: this.idField, value: file_id });

      if (file.length > 0) file = file[0];
    }

    return file;
  };

  this.getBlob = async (file_id) => {
    logger.debug({ name: `${this.name}.getBlob()`, data: file_id }, this.procId, 'method');

    const cachedFile = cache.getTableData(this.table, { field: 'hash', value: file_id });

    if (cachedFile.length === 0) return [];

    cachedFile[0].thumb = await thumb.get(cachedFile[0].name, cachedFile[0].extension);

    const rootDir = __dirname.split('/').slice(0, -1).join('/');
    const dataDir = `${rootDir}/public/${config.data.dir}/`;
    const fileAbsolutePath = `${dataDir}/${cachedFile[0].name}.${cachedFile[0].extension}`;

    if (!fs.existsSync(fileAbsolutePath)) return { error: 'No File found' };

    const buffer = fs.readFileSync(fileAbsolutePath);

    return [{ file: cachedFile[0], blob: buffer }];
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedFiles = cache.getTable(this.table);
    if (cachedFiles.length > 0) return cachedFiles;

    let files = await db.select({ table: this.table });
    if (files.length > 0)
      files = await Promise.all(
        files.map(async (file) => {
          file.thumb = await thumb.get(file.name, file.extension, file.folder);
          return file;
        })
      );
    cache.setTable(this.table, files);

    return cache.getTable(this.table);
  };

  this.delete = async (file_id) => {
    const cachedId = cache.getIdFromHash(this.table, file_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { file: 'Invalid ID' } };

    const res = await db.remove({ id: { field: this.idField, value: cachedId }, table: this.table });

    if (res.affectedRows > 0) {
      const file = cache.getTableData(this.table, { field: this.idField, value: cachedId });

      cache.removeFromTable(this.table, file_id);

      const rootDir = __dirname.split('/').slice(0, -1).join('/');
      const dataDir = `${rootDir}/public/${file[0].folder}/${file[0].name}.${file[0].extension}`;
      const thumbDir = `${rootDir}/public/${file[0].thumb}`;

      fs.unlink(dataDir, (err) => {
        if (err) throw err;
      });
      fs.unlink(thumbDir, (err) => {
        if (err) throw err;
      });
    }

    return res;
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'getAll', 'get', 'save', 'delete'];

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

module.exports = new File();
