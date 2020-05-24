'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const Thread = require('./Thread');

function Board() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.schema = {
    name: { type: 'alpha', length: 45, required: true },
    uri: { type: 'boarduri', length: 10, required: true },
    description: { type: 'alphanum', length: 250 },
  };

  this.save = (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    return db.insert({ body, table: this.table }, this.procId);
  };

  this.get = async (uri) => {
    logger.debug({ name: `${this.name}.get()`, data: uri }, this.procId, 'method');

    let board = await db.select(
      { table: this.table, filters: [{ field: 'uri', value: uri }] },
      this.procId
    );

    if (board.length > 0) {
      Thread.procId = this.procId;
      board[0].threads = await Thread.getByBoard(board[0].board_id);

      if (board[0].threads.length > 0)
        board[0].threads.sort((t1, t2) => {
          if (t1.posts.length > 0 && t2.posts.length > 0)
            return (
              new Date(t2.posts[t2.posts.length - 1].created_on) -
              new Date(t1.posts[t1.posts.length - 1].created_on)
            );
        });
    }

    return board;
  };

  this.getAll = () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    return db.select({ table: this.table }, this.procId);
  };

  this.update = (body) => {
    logger.debug({ name: `${this.name}.update()`, data: body }, this.procId, 'method');

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    return db.update(
      { body, table: this.table, id: { field: this.idField, value: idValue } },
      this.procId
    );
  };

  this.delete = (board_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: board_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(board_id)) return { errors: { board: 'Invalid ID' } };

    return db.remove({ id: { field: this.idField, value: board_id }, table: this.table }, this.procId);
  };

  this.getByID = (board_id) => {
    logger.debug({ name: `${this.name}.getByID()`, data: board_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(board_id)) return { errors: { board: 'Invalid ID' } };

    return db.select(
      {
        table: this.table,
        filters: [{ field: this.idField, value: board_id }],
      },
      this.procId
    );
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'getByID'];

    const functions = Object.entries(this)
      .filter(([key, val]) => typeof val === 'function' && !excluded.includes(key))
      .map(([fnName, fnDef]) => {
        const fnStr = fnDef.toString();
        const fnArgs = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(FN_ARGS);

        return { name: fnName, args: fnArgs };
      });

    return functions;
  };
}

module.exports = new Board();
