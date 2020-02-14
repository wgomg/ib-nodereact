'use strict';

const BaseModel = require('./BaseModel');

const Thread = require('./Thread');

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

Board.prototype.getEntry = function([filters, noJoin], callback) {
  BaseModel.prototype.getEntry.call(this, [filters, noJoin], (err, res) => {
    if (err || res.length === 0) return callback(err, res);

    let board = res[0];
    Thread.getAllEntries(
      (err, res) => {
        if (err) callback(err, null);
        else callback(null, [{ ...board, threads: res }]);
      },
      [{ board_id: board.board_id }, true]
    );
  });
};

module.exports = new Board();
