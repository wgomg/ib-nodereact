'use strict';

const mysql = require('mysql');
const { db } = require('./config/');

const error = require('./utils/error');
const { processNestedResults } = require('./utils/helpers');

const pool = mysql.createPool(db);

const insert = ([table, fields, values], callback) => {
  const sqlValues = values
    .map((v, pos) => {
      let val = '?';
      if (typeof v === 'string' && v.includes('ip')) {
        val = 'INET6_ATON(?)';
        values[pos] = v.split('|')[0];
      }
      return val;
    })
    .join(', ');

  const sql = `INSERT INTO ${table} (${fields}) VALUES (${sqlValues})`;

  pool.query(sql, values, (err, res) => {
    if (err) callback(error(err), null);
    else callback(null, res);
  });
};

const update = ([table, fields, values, id], callback) => {
  const idField = table.toLowerCase().slice(0, -1) + '_id';

  const sqlFieldsValues = fields
    .split(',')
    .map(v => field + ' = ?')
    .join(', ');

  const sql = `Update ${table} SET ${sqlFieldsValues} WHERE ${idField} = ${id}`;

  pool.query(sql, values, (err, res) => {
    if (err) callback(error(err), null);
    else {
      res.updatedId = id;
      callback(null, res);
    }
  });
};

const select = ([table, modelSchema, filters, noJoin], callback) => {
  const schemaFields = Object.keys(modelSchema);
  const filtersFields = filters ? Object.keys(filters) : null;

  let foreignTables = schemaFields.filter(field => modelSchema[field].type === 'table');

  const ipField = schemaFields.filter(field => modelSchema[field].type === 'ip_address');

  let ip_conversion = '';
  if (ipField.length > 0) ip_conversion = `, INET6_NTOA(${ipField[0]}) AS ${ipField[0]}`;

  let sql = `SELECT *${ip_conversion} FROM ${table}`;

  let foreignTable;
  let foreignTableColumnKey;

  if (!noJoin && foreignTables.length > 0) {
    foreignTableColumnKey = foreignTables[0];
    foreignTable =
      foreignTableColumnKey.charAt(0).toUpperCase() + foreignTableColumnKey.slice(1, -3) + 's';

    sql += ` LEFT JOIN ${foreignTable} ON ${foreignTable}.${foreignTableColumnKey} = ${table}.${foreignTableColumnKey}`;
  }

  if (filtersFields && filtersFields.length > 0) {
    sql += ' WHERE ';
    sql += filtersFields.map(field => `${table}.${field} = ?`).join(' AND ');
  }

  if (table === 'Threads' || table === 'Posts') sql += ` ORDER BY ${table}.created_on DESC`;

  let args = [{ sql, nestTables: true }];

  if (filtersFields && filtersFields.length > 0) {
    const values = filtersFields.map(field => filters[field]);
    args.push(values);
  }

  const cb = (err, res) => {
    if (err) callback(error(err), null);
    else callback(null, processNestedResults([table, res, foreignTable]));
  };

  args.push(cb);

  pool.query(...args);
};

const remove = ([table, id], callback) => {
  const idField = table.toLowerCase().slice(0, -1) + '_id';
  const sql = `DELETE FROM ${table} WHERE ${idField} = ?`;

  pool.query(sql, id, (err, res) => {
    if (err) callback(error(err), null);
    else callback(null, res);
  });
};

module.exports = {
  insert,
  select,
  update,
  remove
};
