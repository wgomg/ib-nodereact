'use strict';

const mysql = require('mysql');
const config = require('../config');
const util = require('util');
const pool = mysql.createPool(config.db);
const query = util.promisify(pool.query).bind(pool);

const tagger = require('./tagger');

const allowHtmlTags = ['Tags'];

const insert = (queryData) => {
  const { body, table } = queryData;

  const fields = Object.keys(body)
    .map((field) => field)
    .join(', ');

  const values = Object.values(body).map((v) =>
    allowHtmlTags.includes(table) || typeof v !== 'string' ? v : tagger.strip(v)
  );

  let placeholders = fields
    .split(',')
    .map(() => '?')
    .join(', ');

  const sql = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;

  return query(sql, values);
};

const update = (queryData) => {
  const { body, table, id } = queryData;

  const values = Object.values(body).map((v) =>
    allowHtmlTags.includes(table) || typeof v !== 'string' ? v : tagger.strip(v)
  );

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

module.exports = {
  insert,
  select,
  update,
  remove,
  rawQuery,
};
