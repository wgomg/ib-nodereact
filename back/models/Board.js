'use strict';

const db = require('../db');

const logger = require('../libraries/logger');
const validate = require('../libraries/validate');
const cache = require('../libraries/cache');

function Board() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.name.toLowerCase() + '_id';

  this.procId = null;

  this.schema = {
    name: { type: 'alpha', length: 45, required: true },
    uri: { type: 'boarduri', length: 4, required: true },
    description: { type: 'alphanum', length: 250 },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    let board = await db.insert({ body, table: this.table });

    if (board.insertId) board = await this.get(board.insertId);

    return board;
  };

  this.update = async (body) => {
    logger.debug({ name: `${this.name}.update()`, data: body }, this.procId, 'method');

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    const cachedId = cache.getIdFromHash(this.table, idValue);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { board: 'Invalid ID' } };

    let board = await db.update({
      body,
      table: this.table,
      id: { field: this.idField, value: cachedId },
    });

    if (board.changedRows > 0) board = await this.get(cachedId);

    return board;
  };

  this.getReports = (board_id) => {
    logger.debug({ name: `${this.name}.getReports()`, data: board_id }, this.procId, 'method');

    const cachedId = cache.getIdFromHash(this.table, board_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { board: 'Invalid ID' } };

    const Report = require('./Report');
    return Report.find({ field: this.idField, value: cachedId });
  };

  this.getThreads = (board_id) => {
    logger.debug({ name: `${this.name}.getThreads()`, data: board_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(board_id)) return { errors: { board: 'Invalid ID' } };

    const Thread = require('./Thread');
    return Thread.find({ field: this.idField, value: board_id });
  };

  this.getRules = (board_id) => {
    logger.debug({ name: `${this.name}.getRules()`, data: board_id }, this.procId, 'method');

    const cachedId = cache.getIdFromHash(this.table, board_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { board: 'Invalid ID' } };

    const Rule = require('./Rule');
    return Rule.find({ field: this.idField, value: cachedId });
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    const cachedBoards = cache.getTable(this.table);
    if (cachedBoards.length > 0) return cachedBoards;

    let boards = await db.select({ table: this.table });

    if (boards.length > 0)
      boards = await Promise.all(
        boards.map(async (board) => ({
          ...board,
          threadsIds: (
            await db.select({
              table: 'Threads',
              fields: ['thread_id'],
              filters: [{ field: 'board_id', value: board.board_id }],
            })
          ).map((thread) => thread.thread_id),
        }))
      );
    cache.setTable(this.table, boards);

    return cache.getTable(this.table);
  };

  this.delete = async (board_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: board_id }, this.procId, 'method');

    const cachedId = cache.getIdFromHash(this.table, board_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { board: 'Invalid ID' } };

    const res = await db.remove({ id: { field: this.idField, value: cachedId }, table: this.table });

    if (res.affectedRows > 0) cache.removeFromTable(this.table, banner_id);

    return res;
  };

  this.get = async (board_id) => {
    if (!/^[0-9]+$/i.test(board_id)) return { errors: { board: 'Invalid ID' } };

    const cachedBoard = cache.getTableData(this.table, { field: this.idField, value: board_id });
    if (cachedBoard.length > 0) return cachedBoard;

    let board = await db.select({
      table: this.table,
      filters: [{ field: this.idField, value: board_id }],
    });

    if (board.length > 0) cache.addTableData(this.table, board[0]);

    return cache.getTableData(this.table, { field: this.idField, value: board_id });
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'get'];

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
