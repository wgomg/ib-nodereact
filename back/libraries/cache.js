'use strict';

const shortid = require('shortid');

const config = require('../config').cache;

const NodeCache = require('node-cache');

const cache = new NodeCache();

const HOUR = 60 * 60;
const DAY = 24 * HOUR;

const ttl = {
  userId: config.userIdTTL * DAY,
  dbData: config.dbDataTTL * DAY,
};

const addTableData = (table, value, hashId = true) => {
  let cachedTable = cache.get(table) || [];

  if (hashId) value = { ...value, hash: shortid() };

  const cachedValue = cachedTable.filter(
    (cached) =>
      cached[table.toLowerCase().slice(0, -1) + '_id'] ===
      value[table.toLowerCase().slice(0, -1) + '_id']
  );

  if (cachedValue.length === 0) setTable(table, [...cachedTable, value], hashId);
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
      if (hashId && !value.hash) value = { ...value, hash: shortid() };

      return value;
    }),
    ttl.dbData
  );
};

const updateTableData = (table, value, hashId = true) => {
  let cachedTable = cache.get(table) || [];

  if (cachedTable.length > 0)
    cachedTable = cachedTable.map((entry) => {
      const idField = table.toLowerCase().slice(0, -1) + '_id';
      if (entry[idField] === value[idField]) entry = { ...entry, ...value };

      return entry;
    });

  setTable(table, cachedTable, hashId);
};

const removeFromTable = (table, hash) => {
  let cachedTable = cache.get(table) || [];

  if (cachedTable.length > 0) cachedTable = cachedTable.filter((entry) => entry.hash !== hash);

  setTable(table, cachedTable);
};

const setBannedUser = (user, banTTL = 0) => {
  cache.set(user.ipaddress + '__' + user.fingerprint, { ...user, date: Date.now() }, banTTL * HOUR);

  const found = findBannedUser(user);

  if (!found) {
    let bannedList = getBannedUsersList();
    bannedList.push(user);
    cache.set('bannedusers', bannedList, 0);
  }
};

const findBannedUser = (user) => {
  const bannedList = getBannedUsersList();

  const found = bannedList.filter(
    (banned) => banned.ipaddress === user.ipaddress || banned.fingerprint === user.fingerprint
  );

  return found.length > 0;
};

const getBannedUsersList = () => {
  let bannedList = cache.get('bannedusers');

  bannedList = bannedList
    ? bannedList.filter((user) => cache.get(user.ipaddress + '__' + user.fingerprint))
    : [];
  cache.set('bannedusers', bannedList, 0);

  return bannedList;
};

const setBannedFile = (fileMd5, banTTL = 0) => {
  cache.set(fileMd5, { md5: fileMd5, date: Date.now() }, banTTL * HOUR);

  const found = findBannedFile(fileMd5);

  if (!found) {
    let bannedList = getBannedFilesList();
    bannedList.push({ md5: fileMd5 });
    cache.set('bannedfiles', bannedList, 0);
  }
};

const findBannedFile = (fileMd5) => {
  const bannedList = getBannedFilesList();

  const found = bannedList.filter((file) => file.md5 === fileMd5);

  return found.length > 0;
};

const getBannedFilesList = () => {
  let bannedList = cache.get('bannedfiles');

  bannedList = bannedList ? bannedList.filter((file) => cache.get(file.md5)) : [];
  cache.set('bannedfiles', bannedList, 0);

  return bannedList;
};

const setPostUser = (post, user) => {
  cache.set(post, user, ttl.userId);
};

const getPostUser = (post_id) => cache.get(post_id);

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
  updateTableData,
  removeFromTable,
  setBannedUser,
  findBannedUser,
  getBannedUsersList,
  setBannedFile,
  findBannedFile,
  getBannedFilesList,
  setPostUser,
  getPostUser,
  init,
  close,
  stats,
};
