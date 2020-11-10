'use strict';

const db = require('../libraries/db');
const cache = require('../libraries/cache');
const validate = require('../libraries/validate');

function BaseModel(schema, hashId = true) {
  this.name = this.constructor.name;
  this.dbTable = this.name;
  this.idField = this.name.slice(0, -1).toLowerCase() + '_id';

  this.schema = schema;

  this.hashId = hashId;
}

BaseModel.prototype.validate = function (body) {
  return validate(body, this);
};

BaseModel.prototype.save = async function (body) {
  let res = await db.insert({ body, table: this.dbTable });

  if (res.insertId) {
    res = await this.get([{ field: this.idField, value: res.insertId }]);
    cache.addTableData(this.dbTable, res, this.hashId);

    return res;
  }

  return null;
};

BaseModel.prototype.update = async function (body) {
  let res = await db.update({
    body,
    table: this.dbTable,
    id: { field: this.idField, value: body[this.idField] },
  });

  if (res.changedRows > 0) {
    res = await this.get([
      { field: this.idField, value: body[this.idField] },
      ...Object.entries(body).map(([field, value]) => ({ field, value })),
    ]);

    cache.updateTableData(this.dbTable, res, this.hashId);

    return res;
  }

  return null;
};

BaseModel.prototype.get = async function (filters = [], fields) {
  let cached = cache.getTable(this.dbTable, filters, fields);
  if (cached.length > 0) return cached;

  let res = await db.select({ table: this.dbTable, filters: [] });
  if (res.length > 0) cache.setTable(this.dbTable, res, this.hashId);

  return cache.getTable(this.dbTable, filters, fields);
};

BaseModel.prototype.delete = async function (entryId) {
  entryId = this.getEntryId(entryId);

  if (!entryId) return [{ errors: { [this.name]: 'Invalid ID' } }];

  let res = await db.remove({
    table: this.dbTable,
    id: { field: this.idField, value: entryId },
  });

  if (res.affectedRows > 0) res.deleteId = entryId;

  return res;
};

BaseModel.prototype.getEntryId = function (val) {
  const id = typeof val === 'object' ? val[this.idField] : val;

  return cache.getIdFromHash(this.dbTable, id);
};

BaseModel.prototype.rawQuery = async function (rawQuery) {
  return await db.rawQuery(rawQuery);
};

module.exports = BaseModel;
