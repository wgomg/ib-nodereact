'use strict';

const mysql = require('mysql');
const { db } = require('./config/');

const error = require('./utils/error');
const { processNestedResults } = require('./utils/helpers');

const util = require('util');

const pool = mysql.createPool(db);

/** Funciones de uso general, asíncronas **/
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
    else callback(null, { ...res, updatedId: id });
  });
};

const select = ([table, modelSchema, filters, noJoin, orderBy], callback) => {
  const schemaFields = Object.keys(modelSchema);
  const filtersFields = filters ? Object.keys(filters) : null;

  let foreignTables = schemaFields
    .filter(field => modelSchema[field].type === 'table')
    .map(table_field => {
      return {
        tableIdField: table_field,
        tableName: table_field.charAt(0).toUpperCase() + table_field.slice(1, -3) + 's'
      };
    });

  const ipField = schemaFields.filter(field => modelSchema[field].type === 'ip_address');
  let ip_conversion = '';
  if (ipField.length > 0) ip_conversion = `, INET6_NTOA(${ipField[0]}) AS ${ipField[0]}`;

  let sqlSelect = `SELECT *${ip_conversion}`;
  let sqlFrom = ` FROM ${table}`;
  let sqlJoin = '';

  if (!noJoin && foreignTables.length > 0)
    for (const { tableIdField, tableName } of foreignTables) {
      if (modelSchema[tableIdField].ip_field)
        sqlSelect += `, INET6_NTOA(${tableName}.${modelSchema[tableIdField].ip_field}) AS ${modelSchema[tableIdField].ip_field}`;

      sqlJoin += ` LEFT JOIN ${tableName} ON ${tableName}.${tableIdField} = ${table}.${tableIdField}`;
    }

  let sqlWhere = '';

  if (filtersFields && filtersFields.length > 0) {
    sqlWhere += ' WHERE ';
    sqlWhere += filtersFields
      .map(field => {
        const filterValue = filters[field].length > 1 ? filters[field].split('|') : filters[field];

        let sentenceField = field.includes('.') ? field : `${table}.${field}`;
        let sentenceValue = field.includes('.') ? `= ${filterValue}` : '= ?';

        let sentence = `${sentenceField} ${sentenceValue}`;

        if (filterValue[1]) sentence += ` OR ${sentenceField} IS NULL`;

        return `${sentence}`;
      })
      .join(' AND ');
  }

  let sqlOrderBy = '';
  if (orderBy) sqlOrderBy += ` ORDER BY ${table}.${orderBy.field} ${orderBy.direction}`;

  let sql = sqlSelect + sqlFrom + sqlJoin + sqlWhere + sqlOrderBy;

  let args = [{ sql, nestTables: true }];

  if (filtersFields && filtersFields.length > 0) {
    const values = filtersFields.map(field => (!field.includes('.') ? filters[field] : null));
    args.push(values);
  }

  const cb = (err, res) => {
    if (err) callback(error(err), null);
    else callback(null, processNestedResults([table, res, foreignTables, noJoin]));
  };

  args.push(cb);

  pool.query(...args);
};

const remove = ([table, filter], callback) => {
  const idField = table.toLowerCase().slice(0, -1) + '_id';
  const sql = `DELETE FROM ${table} WHERE ${idField} = ?`;

  pool.query(sql, filter[idField], (err, res) => {
    if (err) callback(error(err), null);
    else callback(null, res);
  });
};

/** Función síncrona añadida por necesidad para autentificación **/
const selectSync = (filters, table) => {
  const filtersFields = Object.keys(filters).map(f => `\`${f}\` = ?`);
  const filtersValues = Object.keys(filters).map(f => filters[f]);

  let sql = `SELECT * FROM ${table}`;

  if (filtersFields.length > 0) sql += ` WHERE ${filtersFields.join(' AND ')}`;

  const querySync = util.promisify(pool.query).bind(pool);

  return querySync(sql, filtersValues);
};

module.exports = {
  insert,
  select,
  update,
  remove,
  selectSync
};
