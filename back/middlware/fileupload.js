'use strict';

const fileupload = require('express-fileupload');

module.exports = [
  fileupload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 },
    safeFileNames: true,
    preserveExtension: 4,
  }),
  // append files object as array to req.body or empty array if no file uploaded
  (req, res, next) => {
    req.body.files = req.files ? Object.values(req.files) : [];
    next();
  },
];
