'use strict';

const express = require('express');
const fileupload = require('express-fileupload');
const Fingerprint = require('express-fingerprint');
const compression = require('compression');
const path = require('path');
const crypto = require('crypto');
const morganBody = require('morgan-body');
const shortid = require('shortid');

const cache = require('./libraries/cache');
const routes = require('./libraries/routes');

const app = express();

app.use(express.json());

/**************** FILEUPLOAD *************************/
app.use(
  fileupload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 },
    safeFileNames: true,
    preserveExtension: 4,
  })
);
// append files object as array to req.body or empty array if no file uploaded
app.use((req, res, next) => {
  req.body.files = req.files ? Object.values(req.files) : [];
  next();
});
// replace fileupload md5 checksum with sha512 checksum
app.use((req, res, next) => {
  req.body.files = req.body.files.map((file) => {
    delete file.md5;
    return {
      ...file,
      checksum: crypto.createHash('sha512').update(file.data).digest('hex'),
    };
  });

  next();
});
/*******************************************************/

app.use(compression());

app.use(express.static(__dirname + '/public'));

app.set('trust proxy', process.env.APP_TRUSTPROXY);

/**************** FINGERPRINT *************************/
app.use(
  Fingerprint({
    parameters: [
      Fingerprint.useragent,
      Fingerprint.acceptHeaders,
      Fingerprint.geoip,
    ],
  })
);
// add fingerprint prop to body
app.use((req, res, next) => {
  req.body.user = {
    ipaddress: req.ip,
    fingerprint: req.fingerprint.hash,
  };

  next();
});
/*****************************************************/

/**************** LOGGING *************************/
app.use((req, res, next) => {
  req.id = shortid.generate();
  next();
});

morganBody(app, {
  logReqHeaderList: ['x-auth-token', 'x-parent-collection'],
  logRequestId: true,
  theme: 'darkened',
  logIP: false,
});
/*************************************************/

routes(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'front', 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve('front', 'build', 'index.html'));
  });
}

cache.init();

module.exports = app;
