'use strict';

const express = require('express');
const fileupload = require('express-fileupload');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const Fingerprint = require('express-fingerprint');

const config = require('./config').logger;
const logger = require('./libraries/logger');

const cache = require('./libraries/cache');

const app = express();

app.use(express.json({ extended: false }));
app.use(
  fileupload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 },
    safeFileNames: true,
    preserveExtension: 4,
  })
);

app.use(compression());

morgan.token('procId', (req, res) => req.procId);
app.use(
  morgan('[:procId] Response :method :status :url :response-time ms - :res[content-length]', {
    stream: logger.stream,
  })
);

app.use(express.static(__dirname + '/public'));

app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders, Fingerprint.geoip],
  })
);

require('./routes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'front', 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve('front', 'build', 'index.html'));
  });
}

if (config.logRoutes)
  logger.debug(app._router.stack.filter((s) => s.name === 'bound dispatch').map((s) => s.route));

cache.init();

module.exports = app;
