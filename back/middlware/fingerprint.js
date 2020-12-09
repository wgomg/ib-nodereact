'use strict';

const Fingerprint = require('express-fingerprint');

const ip = require('../libraries/ip');

module.exports = [
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders]
  }),
  // add fingerprint prop to body
  (req, res, next) => {
    let reqIp = req.ip;

    if (ip.isV4(reqIp)) reqIp = ip.hashV4(reqIp);
    if (ip.isV6(reqIp)) reqIp = ip.hashV6(reqIp);

    req.body.user = {
      ipaddress: reqIp,
      fingerprint: req.fingerprint.hash
    };

    next();
  }
];
