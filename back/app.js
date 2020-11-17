'use strict';

const express = require('express');
const compression = require('compression');
const path = require('path');
const morganBody = require('morgan-body');

const cache = require('./libraries/cache');
const routes = require('./libraries/routes');
const db = require('./libraries/db');

const fileupload = require('./middlware/fileupload');
const fingerprint = require('./middlware/fingerprint');
const requestId = require('./middlware/requestId');

const checkDependencies = require('./util/checkDependencies');

checkDependencies();

db.testConnection();

const app = express();

app.use(
  express.json(),
  compression(),
  express.static(__dirname + '/public'),
  fileupload,
  fingerprint,
  requestId
);

morganBody(app, {
  logReqHeaderList: ['x-auth-token', 'x-parent-collection'],
  logRequestId: true,
  theme: 'darkened',
  logIP: false,
});

routes(app);

app.set('trust proxy', process.env.APP_TRUSTPROXY);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'front', 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve('front', 'build', 'index.html'));
  });
}

cache.init();

module.exports = app;
