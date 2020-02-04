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

const select = ([table, modelSchema, id], callback) => {
  const schemaFields = Object.keys(modelSchema);

  let foreignTables = schemaFields.filter(field => modelSchema[field].type === 'table');

  const ipField = schemaFields.filter(field => modelSchema[field].type === 'ip_address');

  let ip_conversion = '';
  if (ipField.length > 0) ip_conversion = `INET6_NTOA(${ipField[0]}) AS ${ipField[0]}`;

  let sql = `SELECT *, ${ip_conversion} FROM ${table}`;

  let foreignTable;
  let foreignTableColumnKey;

  if (foreignTables.length > 0) {
    foreignTableColumnKey = foreignTables[0];
    foreignTable =
      foreignTableColumnKey.charAt(0).toUpperCase() + foreignTableColumnKey.slice(1, -3) + 's';

    sql += ` LEFT JOIN ${foreignTable} ON ${foreignTable}.${foreignTableColumnKey} = ${table}.${foreignTableColumnKey}`;
  }

  if (id) {
    const idField = table.toLowerCase().slice(0, -1) + '_id';
    sql += ` WHERE ${table}.${idField} = ?`;
  }

  if (table === 'Threads' || table === 'Posts') sql += ` ORDER BY ${table}.created_on DESC`;

  let args = [{ sql, nestTables: true }];

  if (id) args.push(id);

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
