'use strict';

const { isValidDatatype } = require('./helpers');

const bcrypt = require('bcrypt');

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
