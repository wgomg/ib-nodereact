'use strict';

const mysql = require('mysql');
const config = require('./config');
const util = require('util');
const pool = mysql.createPool(config.db);
const query = util.promisify(pool.query).bind(pool);

const tagger = require('./libraries/tagger');

const allowTags = ['Tags'];

const insert = (queryData) => {
  const { body, table, ipField } = queryData;

  const bodyKeysArray = Object.keys(body);

  const fields = bodyKeysArray.map((field) => `\`${field}\``).join(', ');
  const values = Object.values(body).map((v) =>
    allowTags.includes(table) || typeof v !== 'string' ? v : tagger.strip(v)
  );
  let placeholders = Array(fields.split(',').length).fill('?').join(', ');

  if (ipField) {
    const fieldPos = bodyKeysArray.indexOf(ipField);
    placeholders.split(',')[fieldPos] = 'INET6_ATON(?)';
  }

  const sql = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;

  return query(sql, values);
};

const update = (queryData) => {
  const { body, table, id } = queryData;

  const values = Object.values(body).map((v) =>
    allowTags.includes(table) || typeof v !== 'string' ? v : tagger.strip(v)
  );
  const placeholders = Object.keys(body)
    .map((field) => `\`${field}\` = ?`)
    .join(', ');

  const sql = `Update ${table} SET ${placeholders} WHERE ${id.field} = ${pool.escape(id.value)}`;

  return query(sql, values);
};

const select = (queryData) => {
  let { fields, filters, table, orderBy, ipField } = queryData;

  let sql = 'SELECT';

  if (fields) {
    const selectFields = fields.map((field) => `\`${field}\``).join(', ');
    sql += ` ${selectFields}`;
  } else {
    sql += ' *';
  }

  sql += ` FROM ${table}`;

  let filtersValues = null;
  if (filters) {
    let ipFieldPos = -1;

    const filtersFields = filters
      .map((filter, pos) => {
        if (ipField && filter.field === ipField) ipFieldPos = pos;

        let ff = `\`${filter.field}\``;
        if (filter.value === null) ff += ' IS NULL';
        else ff += ' = ?';

        return ff;
      })
      .join(' OR ');

    filters = filters.filter((filter) => filter.value !== null);

    filtersValues = filters.map((filter, pos) => {
      if (ipFieldPos > -1 && pos === ipFieldPos) return `INET6_ATON(${filter.value})`;

      return filter.value;
    });

    sql += ` WHERE ${filtersFields}`;
  }

  if (orderBy) {
    sql += ` ORDER BY ${orderBy.field} ${orderBy.direction}`;
  }

  let queryArgs = [{ sql }];
  if (filtersValues && filtersValues.length > 0) queryArgs.push(filtersValues);

  return query(...queryArgs);
};

const remove = (queryData) => {
  const { id, table } = queryData;

  const sql = `DELETE FROM ${table} WHERE \`${id.field}\` = ${pool.escape(id.value)}`;

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
