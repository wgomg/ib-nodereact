'use strict';

const NodeCache = require('node-cache');
const config = require('../config').cache;

const cache = new NodeCache({ stdTTL: config.ttl });

module.exports = {
  set: (key, value) => cache.set(key, value),
  get: (key) => cache.get(key),
};
