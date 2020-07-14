'use strict';

const css = require('css');
const ip = require('./ip');
const cache = require('./cache');

const validate = (entry, schema, table) => {
  if (Object.keys(entry).length === 0) return { msg: 'Invalid' };

  const schemaFields = Object.keys(schema);

  let errors = {};

  for (let [field, value] of Object.entries(entry)) {
    if (!schemaFields.includes(field)) {
      delete errors[field];
      errors[field] = 'Not expected';
    }

    if (schema[field].required && isEmpty(value)) errors[field] = 'Is required';

    if (schema[field].unique) {
      const found = cache.getTableData(table, { field, value: value.toLowerCase() });
      if (found.length > 0)
        errors[field] = `Unique field, already exists an entry with this value ("${value}")`;
    }

    if (!isEmpty(value)) {
      if (!isValidType(value, schema[field].type)) errors[field] = 'Invalid value';

      if (schema[field].length && entry[field].length > schema[field].length)
        errors[field] = `Value exceeds max. length (${schema[field].length})`;

      if (schema[field].minLength && entry[field].length < schema[field].minLength)
        errors[field] = `Value es below min. length (${schema[field].minLength})`;
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim().length === 0) ||
  value === 0 ||
  typeof value === 'object';

const isValidType = (value, type) => {
  switch (type) {
    case 'boarduri':
      return /^$|^[a-z]+$/i.test(value);

    case 'alpha':
      return /^$|^[a-zA-Z ]+$/i.test(value);

    case 'alphanum':
      return /^$|^[a-zA-Z0-9 ]+$/i.test(value);

    case 'dir':
      return /^$|^[a-zA-Z0-9-_\\/]+$/i.test(value);

    case 'ext':
      return /^[a-z4]{3,4}$/.test(value);

    case 'table':
    case 'num':
      return /^[0-9]+$/i.test(value);

    case 'string':
      return typeof value === 'string';

    case 'tag':
      return !/^$|^[a-zA-Z 0-9]+$/i.test(value);

    case 'bool':
      return typeof value === 'boolean' || value == 1 || value == 0;

    case 'ipaddr':
      value = value.includes('::ffff:') ? value.replace('::ffff:', '') : value;
      return ip.isV4(value) || ip.isV6(value);

    case 'timestamp':
      return true;

    case 'css': {
      const cssObj = css.parse(value, { silent: true });
      return cssObj.stylesheet.parsingErrors.length === 0;
    }

    case 'fileurl':
      return /^(http(s)?:\/\/)?((w){3}.)?(streamable|dai(.ly|lymotion)|vimeo|youtu(be|.be))?(\.com)?\/.+/gm.test(
        value
      );

    case 'list': {
      const options = type.split('|')[1].split(',');

      return options.includes(value);
    }

    default:
      return false;
  }
};

module.exports = validate;
