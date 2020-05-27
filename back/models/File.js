'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');
const thumb = require('../libraries/thumb');

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

    return db.insert({ body: allowed.schemaData, table: this.table }, this.procId);
  };

  this.getByID = async (file_id) => {
    logger.debug({ name: `${this.name}.getByID()`, data: file_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(file_id)) return { errors: { file: 'Invalid ID' } };

    let file = await db.select(
      {
        table: this.table,
        filters: [{ field: this.idField, value: file_id }],
      },
      this.procId
    );

    if (file.length > 0) {
      file[0].thumb = await thumb.get(file[0].name, file[0].extension);
      delete file[0].file_id;
    }

    return file;
  };
}

module.exports = new File();
