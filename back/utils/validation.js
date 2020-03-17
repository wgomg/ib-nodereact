'use strict';

const bcrypt = require('bcrypt');

const ip = require('./ip');

/**
 * schema validation types
 *
 * alpha: string letters only
 * alphanum: string letters and numbers
 * string: string letters, numbers and special chars
 * num: numbers only
 *
 * email: email
 *
 * bool: boolean or [0, 1]
 *
 * ip_address: ipv4 or ipv6
 *
 */
const isValidDatatype = (value, type) => {
  switch (type) {
    case 'alpha':
      return /^$|^[a-zA-Z ]+$/i.test(value);

    case 'alphanum':
      return /^$|^[a-zA-Z0-9 ]+$/i.test(value);

    case 'num':
      return /^[0-9]+$/i.test(value);

    case 'email':
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      );

    case 'string':
      return typeof value === 'string';

    case 'bool':
      return typeof value === 'boolean' || value == 1 || value == 0;

    case 'ip_address':
      value = value.includes('::ffff:') ? value.replace('::ffff:', '') : value;
      return ip.isV4(value) || ip.isV6(value);

    default:
      return false;
  }
};

const entryFieldsMatchSchema = (entry, schema) => {
  const entryFields = Object.keys(entry);
  const schemaFields = Object.keys(schema);

  for (let i = 0; i < entryFields.length; i++)
    if (!schema[entryFields[i]].pk && !schemaFields.includes(entryFields[i])) return false;

  return true;
};

const requiredFields = (entry, schema) => {
  const entryFields = Object.keys(entry);
  const requiredFields = Object.keys(schema).filter(field => schema[field].required);

  for (let i = 0; i < requiredFields.length; i++)
    if (!entryFields.includes(requiredFields[i])) return false;

  return true;
};

const requiredEntryDatatypes = (entry, schema) => {
  for (const field in entry)
    if (
      !schema[field].pk &&
      schema[field].type !== 'table' &&
      !schema[field].type.includes('file') &&
      !isValidDatatype(entry[field], schema[field].type)
    )
      return false;

  return true;
};

const requiredLength = (entry, schema) => {
  for (const field in entry)
    if (schema[field].length && entry[field].length > schema[field].length) return false;

  return true;
};

const requiredUnique = (entry, schema, allEntries) => {
  const uniqueFields = Object.keys(schema).filter(field => schema[field].unique);

  for (let i = 0; i < uniqueFields.length; i++) {
    const uniqueField = uniqueFields[i];
    const currentValuesInUniqueColumn = allEntries.map(entry => entry[uniqueField]);

    let value = entry[uniqueField];

    if (!schema[uniqueField].hashed && currentValuesInUniqueColumn.includes[value]) return false;

    if (schema[uniqueField].hashed) {
      for (let i = 0; i < currentValuesInUniqueColumn.length; i++)
        if (bcrypt.compareSync(value, currentValuesInUniqueColumn[i])) return false;
    }
  }

  return true;
};

module.exports = {
  entryFieldsMatchSchema,
  requiredFields,
  requiredEntryDatatypes,
  requiredLength,
  requiredUnique
};
