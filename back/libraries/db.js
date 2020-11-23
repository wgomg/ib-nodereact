'use strict';

const mysql = require('mysql');
const util = require('util');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: process.env.DB_CHARSET,
  connectionLimit: process.env.DB_CONNLIMIT,
  debug: process.env.DB_DEBUG === 'true',
});

const testConnection = () => {
  pool.getConnection((error) => {
    if (error) throw new Error(error);
  });
};

const query = util.promisify(pool.query).bind(pool);

const insert = (queryData) => {
  const { body, table } = queryData;

  const fields = Object.keys(body)
    .map((field) => field)
    .join(', ');

  const values = Object.values(body);

  let placeholders = fields
    .split(',')
    .map(() => '?')
    .join(', ');

  const sql = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;

  return query(sql, values);
};

const update = (queryData) => {
  const { body, table, id } = queryData;

  const values = Object.values(body);

  const placeholders = Object.keys(body)
    .map((field) => `${field} = ?`)
    .join(', ');

  const sql = `Update ${table} SET ${placeholders} WHERE ${
    id.field
  } = ${pool.escape(id.value)}`;

  return query(sql, values);
};

const select = (queryData) => {
  let { fields, filters, table, orderBy } = queryData;

  let sql = `SELECT ${
    fields ? fields.map((field) => field).join(', ') : '*'
  } FROM ${table}`;

  let filtersValues = null;
  if (filters.length > 0) {
    let filtersFields = filters
      .map(
        (filter) => filter.field + (filter.value === null ? ' IS NULL' : ' = ?')
      )
      .join(' OR ');

    filtersValues = filters
      .filter((filter) => filter.value !== null)
      .map((filter) => filter.value);

    sql += ` WHERE ${filtersFields}`;
  }

  if (orderBy) sql += ` ORDER BY ${orderBy.field} ${orderBy.direction}`;

  return query(sql, filtersValues);
};

const remove = (queryData) => {
  const { id, table } = queryData;

  const sql = `DELETE FROM ${table} WHERE ${id.field} = ${pool.escape(
    id.value
  )}`;

  return query(sql);
};

const rawQuery = (sql) => query(sql);

module.exports = { testConnection, insert, select, update, remove, rawQuery };
