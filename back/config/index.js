'use strict';

const fs = require('fs');
const path = require('path');

const config = {};

fs.readdirSync(__dirname).forEach(fileName => {
  if (fileName === path.basename(__filename)) return;

  const filePath = path.join(__dirname, fileName);
  const fileContent = JSON.parse(fs.readFileSync(filePath));

  config[path.basename(fileName, path.extname(fileName))] = fileContent;
});

module.exports = config;
