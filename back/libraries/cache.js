'use strict';

const shortid = require('shortid');

const config = require('../config').cache;

const NodeCache = require('node-cache');

const cache = new NodeCache();

const ttl = {
  userAdress: config.userAdressTTL,
  dbData: config.dbDataTTL * 24 * 60 * 60,
};

const addTableData = (table, value, hashId = true) => {
  const cachedTable = getTable(table);

  if (hashId) value = { ...value, hash: shortid() };

  const cachedValue = cachedTable.filter(
    (cached) =>
      cached[table.toLowerCase().slice(0, -1) + '_id'] ===
      value[table.toLowerCase().slice(0, -1) + '_id']
  );

  if (cachedValue.length === 0) cache.set(table, [...cachedTable, value], ttl.dbData);
};

const getIdFromHash = (table, hash) => {
  const cachedTable = cache.get(table) || [];

  const entry = cachedTable.filter((entry) => entry.hash === hash);

  if (entry.length > 0) return entry[0][table.toLowerCase().slice(0, -1) + '_id'];

  return null;
};

const getHash = (table, id) => {
  const cachedTable = cache.get(table) || [];

  const entry = cachedTable.filter((entry) => entry[table.toLowerCase().slice(0, -1) + '_id'] === id);

  if (entry.length > 0) return entry[0].hash;

  return null;
};

const getTableData = (table, { field, value }) => {
  const cachedTable = cache.get(table) || [];

  return cachedTable
    .filter((entry) => entry[field] === value)
    .map((entry) => {
      if (entry.hash) {
        entry = { ...entry, [table.toLowerCase().slice(0, -1) + '_id']: entry.hash };
        delete entry.hash;
      }

      return entry;
    });
};

const getTable = (table) => {
  let cachedTable = cache.get(table) || [];

  if (cachedTable.length > 0)
    cachedTable = cachedTable.map((entry) => {
      if (entry.hash) {
        entry = { ...entry, [table.toLowerCase().slice(0, -1) + '_id']: entry.hash };
        delete entry.hash;
      }

      return entry;
    });

  return cachedTable;
};

const setTable = (table, values, hashId = true) => {
  cache.set(
    table,
    values.map((value) => {
      if (hashId) value = { ...value, hash: shortid() };

      return value;
    }),
    ttl.dbData
  );
};

const removeFromTable = (table, hash) => {
  let cachedTable = cache.get(table) || [];

  if (cachedTable.length > 0) cachedTable = cachedTable.filter((entry) => entry.hash !== hash);

  cache.setTable(table, cachedTable);
};

const setBannedAddress = (address, banTTL = 0) => {
  cache.set(address, Date.now(), banTTL);

  let bannedList = getBannedList();

  if (!bannedList.includes(address)) {
    bannedList.push(address);
    cache.set('banned', bannedList, 0);
  }
};

const findBannedAddress = (address) => {
  const bannedList = getBannedList();

  return bannedList.includes(address);
};

const getBannedList = () => {
  let bannedList = cache.get('banned');

  bannedList = bannedList ? bannedList.filter((address) => cache.get(address)) : [];
  cache.set('banned', bannedList, 0);

  return bannedList;
};

const setPostAddress = (post, address) => {
  cache.set(post, address, ttl.userAdress);
};

const getPostAddress = (post_id) => cache.get(post_id);

// TODO: simplificar esto
const init = async () => {
  const Board = require('../models/Board');
  await Board.getAll();

  const Staff = require('../models/Staff');
  await Staff.getAll();

  const Rule = require('../models/Rule');
  await Rule.getAll();

  const File = require('../models/File');
  await File.getAll();

  const Ban = require('../models/Ban');
  Ban.getAll();

  const Banner = require('../models/Banner');
  Banner.getAll();

  const Report = require('../models/Report');
  Report.getAll();

  const Tag = require('../models/Tag');
  Tag.getAll();

  const Theme = require('../models/Theme');
  Theme.getAll();

  const Thread = require('../models/Thread');
  Thread.getAll();

  const Post = require('../models/Post');
  Post.getAll();
};

const close = () => {
  cache.flushAll();
  cache.close();
};

const stats = (stat) => cache.getStats()[stat];

module.exports = {
  addTableData,
  getIdFromHash,
  getHash,
  getTableData,
  getTable,
  setTable,
  removeFromTable,
  setBannedAddress,
  findBannedAddress,
  getBannedList,
  setPostAddress,
  getPostAddress,
  init,
  close,
  stats,
};
