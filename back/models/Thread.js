'use strict';

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const tagger = require('../libraries/tagger');

function Thread() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

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
    Post.schema.file_id.required = true;

    const post = await Post.save(threadOP);

    if (post.validationError) {
      db.remove({ table: this.table, id: { field: this.idField, value: res.insertId } }, this.procId);

      delete post.validationError[this.idField];
      return { ...post, subject: newThread.subject };
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

    if (!/^[0-9]+$/i.test(board_id)) return { validationError: 'Invalid ID' };

    let threads = await db.select(
      {
        table: this.table,
        filters: [{ field: 'board_id', value: board_id }],
        orderBy: { field: 'created_on', direction: 'DESC' },
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

    if (!/^[0-9]+$/i.test(thread_id)) return { validationError: 'Invalid ID' };

    return db.remove({ table: this.table, id: { field: this.idField, value: thread_id } }, this.procId);
  };

  this.getLatests = async () => {
    logger.debug({ name: `${this.name}.getLatests()` }, this.procId, 'method');

    const posts = await db.rawQuery(
      `SELECT MAX(post_id) AS post_id, thread_id, text, created_on FROM Posts GROUP BY thread_id ORDER BY created_on DESC`,
      this.procId
    );

    if (posts.length > 0)
      return await Promise.all(
        posts.slice(0, 10).map(async (post) => {
          const thread = await db.select(
            { table: this.table, filters: [{ field: this.idField, value: post.thread_id }] },
            this.procId
          );

          post.text = await tagger.apply(post.text);

          return { ...thread[0], post };
        })
      );

    return posts;
  };

  this.getBoardId = async (thread_id) => {
    logger.debug({ name: `${this.name}.getBoardId()`, data: thread_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(thread_id)) return { validationError: 'Invalid ID' };

    const thread = await db.select(
      { table: this.table, filters: [{ field: this.idField, value: thread_id }] },
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
