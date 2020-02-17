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

    Thread.getAllEntries(
      (err, response) => {
        if (err) callback(err, null);
        else callback(null, [{ ...res[0], threads: response }]);
      },
      [{ board_id: res[0].board_id }, true]
    );
  });
};

Board.prototype.getBoard = function(filters) {
  return BaseModel.getEntrySync(filters, 'Boards');
};

module.exports = new Board();
