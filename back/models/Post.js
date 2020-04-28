'use strict';
const cache = require('../libraries/cache');

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');
const ip = require('../libraries/ip');

const File = require('./File');
const Thread = require('./Thread');

function Post() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.schema = {
    thread_id: { type: 'table', required: true },
    text: { type: 'string', length: 3000, required: true },
    name: { type: 'alphanum', length: 10 },
    file_id: { type: 'table' },
  };

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const user = body.user;
    delete body.user;

    const Ban = require('./Ban');
    Ban.procId = this.procId;
    const userBanned = await Ban.isUserBanned(user);
    if (userBanned) return { validationError: { user: 'User is banned' } };

    let file = null;
    if (body.files) {
      this.schema.file_id.required = true;

      const files = Object.values(body.files).filter((file) => file.size > 0);
      File.procId = this.procId;
      file = await File.save(files[0]);

      delete body.files;
    }

    const newPost = { ...body };
    if (file) newPostfile_id = file[0].insertId;

    const errors = validate(newPost, this.schema);
    if (errors) return { validationError: errors };

    const post = await db.insert({ body: newPost, table: this.table }, this.procId);

    if (post.insertId) cache.set(post.insertId, user);

    return post;
  };

  this.getByThread = async (thread_id) => {
    logger.debug({ name: `${this.name}.getByThread()`, data: thread_id }, this.procId, 'method');

    let posts = await db.select(
      {
        table: this.table,
        filters: [{ field: 'thread_id', value: thread_id }],
      },
      this.procId
    );

    if (posts.length === 0) return posts;

    File.procId = this.procId;

    return Promise.all(
      posts.map(async (post) => {
        if (post.file_id) {
          const file = await File.getByID(post.file_id);
          post.file = file.length === 0 ? null : file[0];
          delete post.file_id;
        }

        const cachedUser = cache.get(post.post_id);

        if (ip.isV4(cachedUser)) post.user = ip.hashV4(cachedUser);
        else if (ip.isV6(cachedUser)) post.user = ip.hashV6(cachedUser);

        return post;
      })
    );
  };

  this.update = (body) => {
    logger.debug({ name: `${this.name}.update()`, data: body }, this.procId, 'method');

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { validationError: errors };

    return db.update(
      { body, table: this.table, id: { field: this.idField, value: idValue } },
      this.procId
    );
  };

  this.delete = (post_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: post_id }, this.procId, 'method');

    return db.remove({ id: { field: this.idField, value: post_id }, table: this.table }, this.procId);
  };

  this.getBoardId = async (post_id) => {
    logger.debug({ name: `${this.name}.getBoard()`, data: post_id }, this.procId, 'method');

    const post = await db.select(
      { table: this.table, filters: [{ [this.idField]: post_id }] },
      this.procId
    );

    if (post.length === 0) return null;

    return Thread.getBoardId(post.thread_id);
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'getByThread', 'getBoardId'];

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

module.exports = new Post();
