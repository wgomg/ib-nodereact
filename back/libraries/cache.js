'use strict';

const shortid = require('shortid');

const NodeCache = require('node-cache');

const cache = new NodeCache();

const HOUR = 60 * 60;
const DAY = 24 * HOUR;

const ttl = {
  userId: process.env.CACHE_USERID_TTL * DAY,
  dbData: process.env.CACHE_DBDATA_TTL * DAY,
};

const addTableData = (table, entry, hashId = true) => {
  let cachedTable = cache.get(table) || [];

  if (hashId) entry = { ...entry, hash: shortid() };

  const cachedValue = cachedTable.filter(
    (cached) =>
      cached[table.toLowerCase().slice(0, -1) + '_id'] ===
      entry[table.toLowerCase().slice(0, -1) + '_id']
  );

  if (cachedValue.length === 0)
    setTable(table, [...cachedTable, entry], hashId);
};

const getIdFromHash = (table, hash) => {
  if (/^[0-9]+$/i.test(hash)) return hash;

  const cachedTable = cache.get(table) || [];

  const entry = cachedTable.filter((entry) => entry.hash === hash);

  if (entry.length > 0)
    return entry[0][table.toLowerCase().slice(0, -1) + '_id'];

  return null;
};

const getHash = (table, id) => {
  const cachedTable = cache.get(table) || [];

  const entry = cachedTable.filter(
    (entry) => entry[table.toLowerCase().slice(0, -1) + '_id'] === id
  );

  if (entry.length > 0) return entry[0].hash;

  return null;
};

const getTable = (table, filters, fields) => {
  let cachedTable = cache.get(table) || [];

  if (filters.length > 0) {
    cachedTable = cachedTable.filter(
      (entry) =>
        filters.filter((filter) => {
          if (typeof entry[filter.field] !== typeof filter.value) return true;
          else {
            if (typeof filter.value === 'string')
              return (
                entry[filter.field].toLowerCase() !== filter.value.toLowerCase()
              );
            else return entry[filter.field] !== filter.value;
          }
        }).length === 0
    );
  }

  return cachedTable.map((entry) => {
    if (entry.hash) {
      entry = {
        ...entry,
        [table.toLowerCase().slice(0, -1) + '_id']: entry.hash,
      };
      delete entry.hash;
    }

    if (fields) {
      const nonSelectedFields = Object.keys(entry).filter(
        (field) => !fields.includes(field)
      );

      if (nonSelectedFields.length > 0) {
        for (let field of nonSelectedFields) delete entry[field];
      }
    }

    return entry;
  });
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

  if (cachedTable.length > 0)
    cachedTable = cachedTable.filter((entry) => entry.hash !== hash);

  setTable(table, cachedTable);
};

const setBannedUser = (user, banTTL = 0) => {
  cache.set(
    user.ipaddress + '__' + user.fingerprint,
    { ...user, date: Date.now() },
    banTTL * HOUR
  );

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
    (banned) =>
      banned.ipaddress === user.ipaddress ||
      banned.fingerprint === user.fingerprint
  );

  return found.length > 0;
};

const getBannedUsersList = () => {
  let bannedList = cache.get('bannedusers');

  bannedList = bannedList
    ? bannedList.filter((user) =>
        cache.get(user.ipaddress + '__' + user.fingerprint)
      )
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

  bannedList = bannedList
    ? bannedList.filter((file) => cache.get(file.md5))
    : [];
  cache.set('bannedfiles', bannedList, 0);

  return bannedList;
};

const setPostUser = (post, user) => {
  cache.set(post, user, ttl.userId);
};

const getPostUser = (post_id) => cache.get(post_id);

// TODO: simplificar esto
const init = async () => {
  const Boards = new (require('../models/Boards'))();
  await Boards.get();

  const Threads = new (require('../models/Threads'))();
  await Threads.get();

  const Files = new (require('../models/Files'))();
  await Files.get();

  const Posts = new (require('../models/Posts'))();
  await Posts.get();

  const Rules = new (require('../models/Rules'))();
  await Rules.get();

  const Reports = new (require('../models/Reports'))();
  await Reports.get();

  const Banners = new (require('../models/Banners'))();
  await Banners.get();

  const Bans = new (require('../models/Bans'))();
  await Bans.get();
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
