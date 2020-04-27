'use strict';

const fs = require('fs');
const path = require('path');

let Models = {};
const excluded = ['File'];

fs.readdirSync(__dirname).forEach((file) => {
  const thisIndexFile = path.basename(__filename);
  const fileName = path.basename(file, path.extname(file));

  if (file.includes(thisIndexFile) || excluded.includes(fileName)) return;

  Models[fileName] = require('./' + fileName);
});

module.exports = Models;
