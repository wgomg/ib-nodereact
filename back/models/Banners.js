'use strict';

const BaseModel = require('./BaseModel');

function Banners() {
  BaseModel.call(this, {
    board_id: { type: 'int' },
    file_id: { type: 'int', required: true }
  });
}

Banners.prototype = Object.create(BaseModel.prototype);
Banners.prototype.constructor = Banners;

module.exports = Banners;
