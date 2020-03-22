'use strict';

const express = require('express');
const fileupload = require('express-fileupload');

const path = require('path');

const { server } = require('./config/');

const app = express();

app.use(express.json({ extended: false }));
app.use(
  fileupload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 },
    safeFileNames: true,
    preserveExtension: 4
  })
);
app.use('/src/posts', express.static(path.join(__dirname, 'data/image/posts')));
app.use('/src/banners', express.static(path.join(__dirname, 'data/image/banners')));

require('./routes')(app);

const PORT = process.env.PORT || server.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
