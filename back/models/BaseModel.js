'use strict';

const db = require('../libraries/db');
const cache = require('../libraries/cache');

function BaseModel(schema, hashId = true) {
  this.name = this.constructor.name;
  this.dbTable = this.name;
  this.idField = this.name.slice(0, -1).toLowerCase() + '_id';

  this.schema = schema;

  this.hashId = hashId;
}

BaseModel.prototype.validate = function (body) {
  if (Object.keys(body).length === 0) return { msg: 'Invalid' };

  const { dbTable, schema } = this;

  for (let field in body) if (!(field in schema)) delete body[field];

  let errors = {};
  for (let [field, rule] of Object.entries(schema)) {
    if (
      rule.required &&
      (body[field] === undefined ||
        body[field] === null ||
        (typeof body[field] === 'string' && body[field].trim().length === 0) ||
        body[field] === 0 ||
        typeof body[field] === 'object')
    )
      errors[field] = 'Is required';

    if (rule.unique) {
      const found = cache.getTable(dbTable, [
        {
          field,
          value: body[field]
        }
      ]);

      if (found.length > 0)
        errors[
          field
        ] = `Unique field, already exists an entry with this value ('${body[field]}')`;
    }

    if (
      !(
        body[field] === undefined ||
        body[field] === null ||
        (typeof body[field] === 'string' && body[field].trim().length === 0) ||
        body[field] === 0 ||
        typeof body[field] === 'object'
      )
    ) {
      let isValid = true;

      switch (rule.type) {
        case 'int': {
          isValid = Number.isInteger(parseInt(body[field]));
          break;
        }

        case 'string': {
          if (!rule.regex) {
            isValid =
              typeof body[field] === 'string' &&
              body[field].length <= rule.maxlength &&
              (rule.minLength ? body[field].length >= rule.minlength : true);
            break;
          }

          const regexString =
            rule.regex +
            (rule.minlength || rule.maxlength
              ? '{' +
                (rule.minlength ?? '') +
                ',' +
                (rule.maxlength ?? '') +
                '}'
              : '') +
            '$';

          const ruleRegex = new RegExp(regexString, 'gi');

          isValid = ruleRegex.test(body[field]);

          break;
        }

        case 'bool': {
          isValid =
            typeof value === 'boolean' || body[field] == 1 || body[field] == 0;

          break;
        }

        case rule.type.includes('list'): {
          const options = rule.type.split('|')[1].split(',');
          isValid = options.includes(body[field]);

          break;
        }

        default: {
          isValid = true;
          break;
        }
      }

      if (!isValid) errors[field] = 'Invalid value';
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

BaseModel.prototype.replaceHashIdFieldsWithDbId = function ({ field, value }) {
  if (field.includes('_id')) value = parseInt(this.getEntryId(value));

  return { field, value };
};

BaseModel.prototype.save = async function (body) {
  let res = null;

  try {
    res = await db.insert({ body, table: this.dbTable });
  } catch (error) {
    console.error({ ...error, body, stack: error.stack });
    throw error;
  }

  if (res?.insertId) {
    res = await this.get([{ field: this.idField, value: res.insertId }]);
    cache.addTableData(this.dbTable, res, this.hashId);
  }

  return res;
};

BaseModel.prototype.update = async function (body) {
  let res = null;

  try {
    res = await db.update({
      body,
      table: this.dbTable,
      id: { field: this.idField, value: body[this.idField] }
    });
  } catch (error) {
    console.error({ ...error, body, stack: error.stack });
    throw error;
  }

  if (res?.changedRows > 0) {
    res = await this.get([
      { field: this.idField, value: body[this.idField] },
      ...Object.entries(body).map(([field, value]) => ({ field, value }))
    ]);

    cache.updateTableData(this.dbTable, res, this.hashId);
  }

  return res;
};

BaseModel.prototype.get = async function (filters = [], fields) {
  filters = filters.map((filter) => {
    if (filter.value) filter = this.replaceHashIdFieldsWithDbId(filter);

    return filter;
  });

  let cached = cache.getTable(this.dbTable, filters, fields);
  if (cached.length > 0) return cached;

  let res = null;

  try {
    res = await db.select({ table: this.dbTable, filters });
  } catch (error) {
    console.error({ ...error, filters, fields, stack: error.stack });
    throw error;
  }

  if (res?.length > 0) {
    res = res.map((entry) => {
      Object.entries(entry).forEach(([field, value]) => {
        if (field !== this.idField && field.includes('_id')) {
          const table =
            field.slice(0, 1).toUpperCase() +
            field.slice(1).replace('_id', 's');

          entry[field] = cache.getHash(table, value);
        }
      });

      return entry;
    });

    cache.setTable(this.dbTable, res, this.hashId);
  }

  return cache.getTable(this.dbTable, filters, fields);
};

BaseModel.prototype.delete = async function (entryId) {
  entryId = this.getEntryId(entryId);

  if (!entryId) return { errors: { [this.name]: 'Invalid ID' } };

  let res = null;

  try {
    res = await db.remove({
      table: this.dbTable,
      id: { field: this.idField, value: entryId }
    });
  } catch (error) {
    console.error({ ...error, entryId, stack: error.stack });
    throw error;
  }

  if (res?.affectedRows > 0) res.deleteId = entryId;

  return res;
};

BaseModel.prototype.getEntryId = function (val) {
  const id = typeof val === 'object' ? val[this.idField] : val;

  return cache.getIdFromHash(this.dbTable, id);
};

BaseModel.prototype.rawQuery = async function (rawQuery) {
  let res = null;

  try {
    res = await db.rawQuery(rawQuery);
  } catch (error) {
    console.error({ ...error, rawQuery, stack: error.stack });
    throw error;
  }
  return res;
};

BaseModel.prototype.getSchema = function () {
  return this.schema;
};

module.exports = BaseModel;
