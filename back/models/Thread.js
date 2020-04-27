'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

function Thread() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().replace('s', '_id');

  this.procId = null;

  this.schema = {
    board_id: { type: 'table', required: true },
    subject: { type: 'alphanum', length: 45, required: true },
    file_id: {},
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const newThread = { board_id: body.board_id, subject: body.subject };

    const errors = validate(newThread, this.schema);
    if (errors) return { validationError: errors };

    const res = await db.insert({ body: newThread, table: this.table }, this.procId);

    const threadOP = {
      text: body.text,
      name: body.name,
      files: body.files,
      user: body.user,
      [this.idField]: res.insertId,
    };

    const Post = require('./Post');
    Post.procId = this.procId;

    const post = await Post.save(threadOP);

    if (post.validationError) {
      db.remove({ table: this.table, id: { field: this.idField, value: res.insertId } }, this.procId);

      delete post.validationError[this.idField];
      return post;
    }

    const thread = await db.select(
      {
        table: this.table,
        filters: [{ field: this.idField, value: res.insertId }],
      },
      this.procId
    );

    if (thread.length === 0) return thread;
    else
      return [
        {
          ...thread[0],
          posts: await Post.getByThread(thread[0].thread_id),
        },
      ];
  };

  this.getByBoard = async (board_id) => {
    logger.debug({ name: `${this.name}.getByBoard()`, data: board_id }, this.procId, 'method');

    let threads = await db.select(
      {
        table: this.table,
        filters: [{ field: 'board_id', value: board_id }],
      },
      this.procId
    );

    const Post = require('./Post');
    Post.procId = this.procId;

    if (threads.length > 0)
      return Promise.all(
        threads.map(async (thread) => {
          thread.posts = await Post.getByThread(thread.thread_id);
          return thread;
        })
      );

    return threads;
  };

  this.delete = (thread_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: thread_id });

    return db.remove({ table: this.table, id: { field: this.idField, value: thread_id } }, this.procId);
  };

  this.getBoardId = async (thread_id) => {
    logger.debug({ name: `${this.name}.getBoard()`, data: thread_id }, this.procId, 'method');

    const thread = await db.select(
      { table: this.table, filters: [{ [this.idField]: thread_id }] },
      this.procId
    );

    if (thread.length === 0) return null;

    return thread[0].board_id;
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'getByBoard', 'getBoardId'];

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

module.exports = new Thread();
