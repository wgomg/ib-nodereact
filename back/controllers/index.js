'use strict';

const fs = require('fs');
const path = require('path');

let controllers = [];

fs.readdirSync(__dirname).forEach((file) => {
  if (
    file.includes(path.basename(__filename)) ||
    file.includes('BaseController')
  )
    return;

  const fileName = path.basename(file, path.extname(file));

  try {
    controllers.push(require('./' + fileName));
  } catch (error) {
    console.error(error);
  }
});

module.exports = controllers;
