'use strict';

const shortid = require('shortid');

module.exports = (req, res, next) => {
  req.id = shortid.generate();
  next();
};
