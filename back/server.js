'use strict';

const express = require('express');
const fileupload = require('express-fileupload');

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

require('./routes.js')(app);

const PORT = process.env.PORT || server.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
