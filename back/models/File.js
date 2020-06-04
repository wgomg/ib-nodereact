'use strict';

const db = require('../db');

const logger = require('../libraries/logger');
const validate = require('../libraries/validate');
const thumb = require('../libraries/thumb');
const cache = require('../libraries/cache');

const AllowedFile = require('../libraries/AllowedFile');

function File() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.schema = {
    mimetype: { type: 'string', length: 12, required: true },
    name: { type: 'alphanum', length: 50, required: true },
    extension: { type: 'ext', length: 4, required: true },
    size: { type: 'num', required: true },
    folder: { type: 'dir', length: 20, required: true },
  };

  this.save = async (file) => {
    logger.debug({ name: `${this.name}.save()`, data: file }, this.procId, 'method');

    const allowed = new AllowedFile(file);

    if (allowed.errors) return { errors: { file: allowed.error } };

    const errors = validate(allowed.schemaData, this.schema);
    if (errors) return { errors };

    await allowed.saveToDisk();
    await allowed.generateThumb();

    if (allowed.errors) return { errors: { file: allowed.error } };

    file = await db.insert({ body: allowed.schemaData, table: this.table });

    if (file.insertId) {
      file = await db.select({
        table: this.table,
        filters: [{ field: this.idField, value: file.insertId }],
      });

      if (file.length > 0) file = this.get(file.insertId);
    }

    return file;
  };

  this.get = async (file_id) => {
    if (!/^[0-9]+$/i.test(file_id)) return { errors: { post: 'Invalid ID' } };

    const cachedFile = cache.getTableData(this.table, { field: this.idField, value: file_id });

    if (cachedFile.length > 0) return cachedFile;

    let file = await db.select({
      table: this.table,
      filters: [{ field: this.idField, value: file_id }],
    });

    if (file.length > 0) {
      file[0].thumb = await thumb.get(file[0].name, file[0].extension);
      cache.addTableData(this.table, file[0]);
      file = cache.getTableData(this.table, { field: this.idField, value: file_id });
    }

    return file;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedFiles = cache.getTable(this.table);
    if (cachedFiles.length > 0) return cachedFiles;

    let files = await db.select({ table: this.table });
    if (files.length > 0)
      files = await Promise.all(
        files.map(async (file) => {
          file.thumb = await thumb.get(file.name, file.extension);
          return file;
        })
      );
    cache.setTable(this.table, files);

    return cache.getTable(this.table);
  };
}

module.exports = new File();
