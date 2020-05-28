'use strict';

const cache = require('../libraries/cache');

const db = require('../db');
const logger = require('../libraries/logger');
const tagger = require('../libraries/tagger');
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
    if (userBanned) return { errors: { user: 'User is banned' } };

    let file = null;

    if (Object.keys(body.files).length > 0) {
      this.schema.file_id.required = true;

      const files = Object.values(body.files).filter((file) => file.size > 0);
      File.procId = this.procId;
      file = await File.save(files[0]);
    }

    delete body.files;

    let newPost = { ...body };
    if (file && file.errors) return { errors: file.errors };

    if (file) newPost.file_id = file.insertId;

    const errors = validate(newPost, this.schema);
    if (errors) return { errors };

    newPost = await db.insert({ body: newPost, table: this.table }, this.procId);

    if (newPost.insertId) {
      cache.setValueInObject('users', { key: newPost.insertId, value: user }, 'userAddress');

      let post = await db.select(
        {
          table: this.table,
          filters: [{ field: this.idField, value: newPost.insertId }],
        },
        this.procId
      );

      if (post.length > 0) {
        if (post[0].file_id) {
          const file = await File.getByID(post[0].file_id);
          post[0].file = file.length > 0 ? file[0] : null;
          delete post[0].file_id;
        }

        const tagged = await tagger.apply(post[0].text, this.procId);
        post[0].text = tagged.text;

        if (tagged.quoted && tagged.quoted.length > 0)
          post[0].quoted = await Promise.all(
            tagged.quoted.map(async (quoted_id) => await this.get(quoted_id))
          );
      }

      return post;
    }

    return newPost;
  };

  this.getByThread = async (thread_id) => {
    logger.debug({ name: `${this.name}.getByThread()`, data: thread_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(thread_id)) return { errors: { thread: 'Invalid ID' } };

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

        const cachedUser = cache.getValueInObject('Users', post.post_id);

        if (ip.isV4(cachedUser)) post.user = ip.hashV4(cachedUser);
        else if (ip.isV6(cachedUser)) post.user = ip.hashV6(cachedUser);

        const tagged = await tagger.apply(post.text, this.procId);
        post.text = tagged.text;

        if (tagged.quoted && tagged.quoted.length > 0)
          post.quoted = await Promise.all(
            tagged.quoted.map(async (quoted_id) => await this.get(quoted_id))
          );

        return post;
      })
    );
  };

  this.delete = (post_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: post_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(thread_id)) return { errors: { post: 'Invalid ID' } };

    return db.remove({ id: { field: this.idField, value: post_id }, table: this.table }, this.procId);
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

  this.get = async (post_id) => {
    logger.debug({ name: `${this.name}.get()`, data: post_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(post_id)) return { errors: { post: 'Invalid ID' } };

    let post = await db.select(
      {
        table: this.table,
        filters: [{ field: this.idField, value: post_id }],
      },
      this.procId
    );

    if (post.length > 0) {
      post = post[0];

      if (post.file_id) {
        const file = await File.getByID(post.file_id);
        post.file = file.length === 0 ? null : file[0];
        delete post.file_id;
      }

      const board_id = await this.getBoardId(post_id);
      const Board = require('./Board');
      Board.procId = this.procId;
      post.board = await Board.getByID(board_id);

      const tagged = await tagger.apply(post.text, this.procId);
      post.text = tagged.text;

      if (tagged.quoted && tagged.quoted.length > 0)
        post.quoted = await Promise.all(
          tagged.quoted.map(async (quoted_id) => await this.get(quoted_id))
        );
    }

    return post;
  };

  this.getBoardId = async (post_id) => {
    logger.debug({ name: `${this.name}.getBoardId()`, data: post_id }, this.procId, 'method');

    if (!/^[0-9]+$/i.test(post_id)) return { errors: { post: 'Invalid ID' } };

    const post = await db.select(
      { table: this.table, filters: [{ field: this.idField, value: post_id }] },
      this.procId
    );

    if (post.length === 0) return null;

    Thread.procId = this.procId;
    return Thread.getBoardId(post[0].thread_id);
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'getByThread', 'getBoardId', 'get', 'update'];

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
