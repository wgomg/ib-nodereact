'use strict';

const BaseModel = require('./BaseModel');

function Boards() {
  BaseModel.call(this, {
    name: {
      type: 'string',
      regex: '^([a-zA-Z ])',
      minlength: 4,
      maxlength: 45,
      required: true,
      unique: true
    },
    uri: {
      type: 'string',
      regex: '^([a-zA-Z ])',
      minlength: 1,
      maxlength: 4,
      required: true,
      unique: true
    },
    description: {
      type: 'string',
      regex: '^([a-zA-Z0-9 ])',
      minlength: 10,
      maxlength: 250,
      required: true
    }
  });
}

Boards.prototype = Object.create(BaseModel.prototype);
Boards.prototype.constructor = Boards;

Boards.prototype.getThreads = async function (board_id) {
  const Threads = new (require('./Threads'))();

  return (await Threads.get([{ field: this.idField, value: board_id }])).map(
    (thread) => {
      delete thread.board_id;
      return thread;
    }
  );
};

Boards.prototype.getReports = async function (board_id) {
  const Reports = new (require('./Reports'))();
  return await Reports.get([{ field: this.idField, value: board_id }]);
};

Boards.prototype.getRules = async function (board_id) {
  const Rules = new (require('./Rules'))();
  return await Rules.get([{ field: this.idField, value: board_id }]);
};

Boards.prototype.getBanners = async function (board_id) {
  const Banners = new (require('./Banners'))();
  return await Banners.get([{ field: this.idField, value: board_id }]);
};

module.exports = Boards;
