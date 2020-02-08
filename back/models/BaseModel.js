'use strict';

const db = require('../db');

const {
  entryFieldsMatchSchema,
  requiredFields,
  requiredEntryDatatypes,
  requiredLength,
  requiredUnique
} = require('../utils/validation');

const error = require('../utils/error');

const bcrypt = require('bcrypt');

/**
 * Constructor for BaseModel
 */
function BaseModel(classname, schema) {
  this._table = classname.charAt(0).toUpperCase() + classname.slice(1) + 's';

  this._schema = schema;
}

const validate = (entry, schema, allEntries) => {
  // check that entry fields are all in schema
  if (!entryFieldsMatchSchema(entry, schema)) return false;

  // check required fields
  if (!requiredFields(entry, schema)) return false;

  // check data types
  if (!requiredEntryDatatypes(entry, schema)) return false;

  // check length if required
  if (!requiredLength(entry, schema)) return false;

  // check unique fields if any
  if (!requiredUnique(entry, schema, allEntries)) return false;

  return true;
};

/**
 * Save entry to database
 */
BaseModel.prototype.saveEntry = function(entry, callback) {
  this.getAllEntries((err, res) => {
    if (!validate(entry, this._schema, res))
      callback(
        error({
          code: 'ER_INVALID_FIELDS',
          message: 'There are invalid fields, please check them and try again'
        }),
        null
      );
    else {
      const fields = Object.keys(entry)
        .map(field => '`' + field + '`')
        .join(', ');
      const values = Object.keys(entry).map(field => {
        if (this._schema[field].hashed) entry[field] = bcrypt.hashSync(entry[field], 10);

        if (this._schema[field].type === 'ip_address') entry[field] = entry[field] + '|ip';

        return entry[field];
      });

      db.insert([this._table, fields, values], (err, res) => callback(err, res));
    }
  });
};

/**
 * Updates an entry
 */
BaseModel.prototype.updateEntry = function(entry, callback) {
  this.getAllEntries((err, res) => {
    if (!validate(entry, this._schema, res))
      callback(
        error({
          code: 'ER_INVALID_FIELDS',
          message: 'There are invalid fields, please check them and try again'
        }),
        null
      );
    else {
      const idField = this._table.toLowerCase().slice(0, -1) + '_id';
      const id = entry[idField];

      delete entry[idField];

      const fields = Object.keys(entry)
        .map(field => '`' + field + '`')
        .join(', ');
      const values = Object.keys(entry).map(field => {
        if (this._schema[field].hashed) entry[field] = bcrypt.hashSync(entry[field], 10);

        return entry[field];
      });

      db.update([this._table, fields, values, id], (err, res) => callback(err, res));
    }
  });
};

/**
 * Get entry by id from database
 */
BaseModel.prototype.getEntry = function(id, callback) {
  db.select([this._table, this._schema, id], (err, res) => callback(err, res));
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
