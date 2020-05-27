'use strict';

const config = require('../config').cache;
const shortid = require('shortid');

const NodeCache = require('node-cache');

const cache = new NodeCache();

const ttl = {
  userAdress: config.userAdressTTL,
  dbData: config.dbDataTTL * 24 * 60 * 60,
};

const setSingleValue = (name, value, ttlValue) => {
  if (value.constructor.name === 'Object') throw new Error('Value is an object');

  cache.set(name, value, ttl[ttlValue]);

  return value;
};

const getSingleValue = (name) => {
  const value = cache.get(name);

  if (value && value.constructor.name === 'Object') throw new Error('Value is an object');

  return value;
};

const setHashId = (table, id, ttlValue) => {
  let cachedId = getValueInObject(table, id);

  if (!cachedId) {
    const hash = shortid.generate();
    const cachedTable = getObject(table);
    cache.set(table, { ...cachedTable, [id]: hash }, ttl[ttlValue]);
    cachedId = hash;
  }

  return cachedId;
};

const getObject = (object) => {
  let cachedObject = cache.get(object);

  if (cachedObject && cachedObject.constructor.name !== 'Object')
    throw new Error('There is a non-object value named `' + object + '` already stored in cache');

  if (!cachedObject) {
    cache.set(object, {}, 'dbData');
    cachedObject = {};
  }

  return cachedObject;
};

const setObject = (object, value) => {
  let cachedObject = getObject(object);

  if (cachedObject && cachedObject.constructor.name !== 'Object')
    throw new Error('There is a non-object value named `' + object + '` already stored in cache');

  if (!cachedObject) {
    cache.set(object, value, 'dbData');
    cachedObject = value;
  }

  return cachedObject;
};

const setValueInObject = (object, { key, value }, ttlValue) => {
  let cachedValue = getValueInObject(object, key);

  if (!cachedValue) {
    const cachedObject = getObject(object);
    cache.set(object, { ...cachedObject, [key]: value }, ttl[ttlValue]);
    cachedValue = value;
  }

  return cachedValue;
};

const getValueInObject = (object, key) => {
  const cachedObject = cache.get(object) || {};
  return cachedObject[key];
};

const getKeyInObject = (object, value) => {
  const cachedObject = cache.get(object) || {};
  return Object.keys(cachedObject).find((key) => cachedObject[key] === value);
};

const stats = (stat) => cache.getStats()[stat];

const init = () => {
  const Board = require('../models/Board');
  const Staff = require('../models/Staff');

  Board.getAll();
  Staff.getAll();
};

const close = () => {
  cache.flushAll();
  cache.close();
};

module.exports = {
  setSingleValue,
  getSingleValue,
  setHashId,
  setObject,
  getObject,
  getKeyInObject,
  getKeyInObject,
  getValueInObject,
  setValueInObject,
  stats,
  init,
  close,
};
