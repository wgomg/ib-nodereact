'use strict';

const css = require('css');

const validate = (entry, schema) => {
  if (Object.keys(entry).length === 0) return { msg: 'Invalid' };

  const schemaFields = Object.keys(schema);

  let errors = {};

  for (let [field, value] of Object.entries(entry)) {
    if (!schemaFields.includes(field)) {
      delete errors[field];
      errors[field] = 'Not expected';
    }

    if (schema[field].required && isEmpty(value)) errors[field] = 'Is required';

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
      return /^$|^[a-zA-Z0-9-_\\\/]+$/i.test(value);

    case 'ext':
      return /^[a-z]{3,4}$/.test(value);

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

    case 'css':
      const cssObj = css.parse(value, { silent: true });
      return cssObj.stylesheet.parsingErrors.length === 0;

    default:
      return false;
  }
};

const objectsAreNotEqual = (obj1, obj2) => JSON.stringify(obj1) !== JSON.stringify(obj2);

module.exports = validate;
