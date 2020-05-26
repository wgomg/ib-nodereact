'use strict';

const NodeCache = require('node-cache');

const cache = new NodeCache();

module.exports = {
  set: (key, value, ttl) => cache.set(key, value, ttl),
  get: (key) => cache.get(key),
  stats: (stat) => cache.getStats()[stat],
};
