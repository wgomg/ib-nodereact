'use strict';

const crypto = require('crypto');

const isV4 = (ip) => /\d+\.\d+(\.\d+)?(\.\d+)?/.test(ip);

const isV6 = (ip) => /([0-9a-f]{1,4}:){1,7}[0-9a-f]{1,4}/.test(ip);

const hashV4 = (ip) => {
  let parts = ip.split('.');
  let acc = '';

  parts = parts.map((segment, i) => {
    const part = haship(acc + segment + i, 3);
    acc += segment;
    return part;
  });

  while (parts.length < 4) parts.push('*');

  return parts.join('.');
};

const hashV6 = (ip) => {
  let parts = ip.split(':');
  parts.splice(4, 4);
  let acc = '';

  parts = parts.map((segment, i) => {
    const part = haship(acc + segment + i, 4);
    acc += segment;
    return part;
  });

  while (parts.length < 4) parts.push('*');
  return parts.join(':');
};

const haship = (str, len) => {
  const md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('base64').substring(0, len);
};

module.exports = {
  isV4,
  isV6,
  hashV4,
  hashV6,
};
