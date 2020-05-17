'use strict';

const express = require('express');
const fileupload = require('express-fileupload');
const compression = require('compression');
const morgan = require('morgan');
// const path = require('path');

const config = require('./config').logger;
const logger = require('./libraries/logger');

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

// app.use('/files', express.static(path.join(__dirname, 'data/image/posts')));
// app.use('/src/banners', express.static(path.join(__dirname, 'data/image/banners')));

app.use(compression());

morgan.token('procId', (req, res) => req.procId);
app.use(
  morgan('[:procId] Response :method :status :url :response-time ms - :res[content-length]', {
    stream: logger.stream,
  })
);

app.use(express.static('public'));

require('./routes')(app);

if (config.logRoutes)
  logger.debug(app._router.stack.filter((s) => s.name === 'bound dispatch').map((s) => s.route));

module.exports = app;
