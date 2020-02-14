'use strict';

const db = require('../db');

const validation = require('../utils/validation');

const error = require('../utils/error');

const bcrypt = require('bcrypt');

function BaseModel(classname, schema) {
  this._table = classname.charAt(0).toUpperCase() + classname.slice(1) + 's';

  this._schema = schema;
}

const isEntryValid = ([entry, schema, allEntries]) => {
  if (!validation.entryFieldsMatchSchema(entry, schema)) return false;

  if (!validation.requiredFields(entry, schema)) return false;

  if (!validation.requiredEntryDatatypes(entry, schema)) return false;

  if (!validation.requiredLength(entry, schema)) return false;

  if (!validation.requiredUnique(entry, schema, allEntries)) return false;

  return true;
};

BaseModel.prototype.saveEntry = function(entry, callback) {
  this.getAllEntries((err, res) => {
    if (!isEntryValid([entry, this._schema, res]))
      return callback(error({ code: 'ER_INVALID_FIELDS' }), null);

    const fields = Object.keys(entry)
      .map(field => '`' + field + '`')
      .join(', ');

    const values = Object.keys(entry).map(field => {
      if (this._schema[field].hashed) entry[field] = bcrypt.hashSync(entry[field], 10);

      if (this._schema[field].type === 'ip_address') entry[field] = entry[field] + '|ip';

      return entry[field];
    });

    db.insert([this._table, fields, values], (err, res) => callback(err, [res]));
  });
};

/**
 * Updates an entry
 */
BaseModel.prototype.updateEntry = function(entry, callback) {
  this.getAllEntries((err, res) => {
    if (!isEntryValid([entry, this._schema, res]))
      return callback(error({ code: 'ER_INVALID_FIELDS' }), null);

    const idField = this._table.toLowerCase().slice(0, -1) + '_id';
    const entryId = entry[idField];

    delete entry[idField];

    const fields = Object.keys(entry)
      .map(field => '`' + field + '`')
      .join(', ');
    const values = Object.keys(entry).map(field => {
      if (this._schema[field].hashed) entry[field] = bcrypt.hashSync(entry[field], 10);

      return entry[field];
    });

    db.update([this._table, fields, values, entryId], (err, res) => callback(err, [res]));
  });
};

/**
 * Get entry by id from database
 */
BaseModel.prototype.getEntry = function([filters, noJoin], callback) {
  db.select([this._table, this._schema, filters, noJoin], (err, res) => callback(err, res));
};

/**
 * Delete entry from database by id
 */
BaseModel.prototype.deleteEntry = function(id, callback) {
  db.remove([this._table, id], (err, res) => callback(err, res));
};

/**
 * Get all entries from database
 */
BaseModel.prototype.getAllEntries = function(callback) {
  db.select([this._table, this._schema], (err, res) => callback(err, res));
};

module.exports = BaseModel;
