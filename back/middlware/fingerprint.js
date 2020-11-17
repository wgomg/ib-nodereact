'use strict';

const Fingerprint = require('express-fingerprint');

module.exports = [
  Fingerprint({
    parameters: [
      Fingerprint.useragent,
      Fingerprint.acceptHeaders,
      Fingerprint.geoip,
    ],
  }),
  // add fingerprint prop to body
  (req, res, next) => {
    req.body.user = {
      ipaddress: req.ip,
      fingerprint: req.fingerprint.hash,
    };

    next();
  },
];
