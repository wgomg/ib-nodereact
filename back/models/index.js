'use strict';

const fs = require('fs');
const path = require('path');

let Models = {};

fs.readdirSync(__dirname).forEach(file => {
  if (file.includes(path.basename(__filename)) || file.includes('BaseModel'))
    return;

  const fileName = path.basename(file, path.extname(file));

  Models[fileName] = require('./' + fileName);
});

module.exports = Models;
