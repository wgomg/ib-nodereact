'use strict';

const fs = require('fs');
const path = require('path');

let models = {};

fs.readdirSync(__dirname).forEach((file) => {
  if (file.includes(path.basename(__filename)) || file.includes('BaseModel'))
    return;

  const fileName = path.basename(file, path.extname(file));
  models[fileName] = require('./' + fileName);
});

module.exports = models;
