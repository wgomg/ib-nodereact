'use strict';

const db = require('../libraries/db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');

const cache = require('../libraries/cache');

const tagger = require('../libraries/tagger');

function Thread() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.name.toLowerCase() + '_id';

  this.procId = null;

  this.schema = {
    board_id: { type: 'table', required: true },
    subject: { type: 'alphanum', length: 45, required: true },
    file_id: {},
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const newThread = { board_id: cache.getIdFromHash('Boards', body.board_id), subject: body.subject };

    const errors = validate(newThread, this.schema);
    if (errors) return { errors };

    let thread = await db.insert({ body: newThread, table: this.table });

    if (thread.insertId) {
      const threadOP = {
        text: body.text,
        name: body.name,
        files: body.files,
        user: body.user,
        [this.idField]: thread.insertId,
      };

      const Post = require('./Post');
      Post.procId = this.procId;
      Post.schema.file_id.required = true;

      const post = await Post.save(threadOP);

      if (post.errors) {
        await db.remove({ table: this.table, id: { field: this.idField, value: thread.insertId } });

        delete post.errors[this.idField];
        return { errors: post.errors };
      }

      thread = await db.select({
        table: this.table,
        filters: [{ field: this.idField, value: thread.insertId }],
      });

      if (thread.length > 0) {
        thread[0] = { ...thread[0], board_id: cache.getHash('Boards', thread[0].board_id) };
        cache.addTableData(this.table, thread[0], false);

        const posts = await this.getPosts(thread[0].thread_id);
        thread = cache.getTableData(this.table, { field: this.idField, value: thread[0].thread_id });
        thread[0].posts = posts;
      }
    }

    return thread;
  };

  this.getLatests = async () => {
    logger.debug({ name: `${this.name}.getLatests()` }, this.procId, 'method');

    const posts = await db.rawQuery(
      `SELECT * FROM Posts ` +
        `WHERE created_on = ` +
        `(SELECT MAX(created_on) FROM Posts latest WHERE thread_id = Posts.thread_id) ` +
        `ORDER BY created_on DESC LIMIT 10`,
      this.procId
    );

    if (posts.length > 0)
      return await Promise.all(
        posts.slice(0, 10).map(async (post) => {
          const thread = await db.select(
            { table: this.table, filters: [{ field: this.idField, value: post.thread_id }] },
            this.procId
          );

          thread[0].board_id = cache.getHash('Boards', thread[0].board_id);

          const Board = require('./Board');
          Board.procId = this.procId;
          post.board = await Board.get(cache.getIdFromHash('Boards', thread[0].board_id));

          post.text = await tagger.apply(post, this.procId);

          return { ...thread[0], post };
        })
      );

    return posts;
  };

  this.getPosts = (thread_id) => {
    logger.debug({ name: `${this.name}.getPosts()`, data: thread_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(thread_id)) return { errors: { thread: 'Invalid ID' } };

    const Post = require('./Post');
    Post.procId = this.procId;
    return Post.find({ field: this.idField, value: thread_id });
  };

  this.get = async (thread_id) => {
    logger.debug({ name: `${this.name}.get()`, data: thread_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(thread_id)) return { errors: { thread: 'Invalid ID' } };

    thread_id = parseInt(thread_id);

    const cachedThread = cache.getTableData(this.table, { field: this.idField, value: thread_id });

    if (cachedThread.length > 0) {
      let posts = await this.getPosts(thread_id);
      posts = posts.sort((p1, p2) => p1.post_id - p2.post_id);

      cachedThread[0].posts = posts;

      return cachedThread;
    }

    let threads = await this.find({ field: this.idField, value: thread_id });

    if (threads.length > 0) {
      threads[0].posts = await this.getPosts(threads[0].thread_id);
      cache.addTableData(this.table, threads[0]);
    }

    return cache.getTableData(this.table, { field: this.idField, value: thread_id });
  };

  this.find = async (filters) => {
    const cachedThreads = cache.getTableData(this.table, { ...filters });
    if (cachedThreads.length > 0) return cachedThreads;

    let threads = await db.select({ table: this.table, filters: [{ ...filters }] });

    if (threads.length > 0)
      threads.forEach((thread) => {
        thread = { ...thread, board_id: cache.getHash('Boards', thread.board_id) };

        cache.addTableData(this.table, thread, false);
      });

    return cache.getTableData(this.table, { ...filters });
  };

  this.getAll = async () => {
    const cachedThreads = cache.getTable(this.table);
    if (cachedThreads.length > 0) return cachedThreads;

    let threads = await db.select({ table: this.table });

    threads = threads.map((thread) => ({
      ...thread,
      board_id: cache.getHash('Boards', thread.board_id),
    }));

    cache.setTable(this.table, threads, false);

    return cache.getTable(this.table);
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'find', 'getAll'];

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
