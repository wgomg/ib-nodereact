'use strict';

const BaseModel = require('./BaseModel');

function Board() {
  const classname = 'board';

  const schema = {
    board_id: { pk: true },
    name: { type: 'alpha', length: 45, required: true, unique: true },
    uri: { type: 'alpha', length: 10, required: true, unique: true },
    description: { type: 'alphanum', length: 250, required: true }
  };

  BaseModel.call(this, classname, schema);
}

Board.prototype = Object.create(BaseModel.prototype);

module.exports = new Board();
