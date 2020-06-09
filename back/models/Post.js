'use strict';

const db = require('../db');

const logger = require('../libraries/logger');
const tagger = require('../libraries/tagger');
const validate = require('../libraries/validate');
const ip = require('../libraries/ip');
const cache = require('../libraries/cache');

const File = require('./File');

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
    file_url: { type: 'fileurl', length: 500 },
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

    if (file && file.errors) return { errors: file.errors };

    delete body.files;

    if (file) body.file_id = cache.getIdFromHash('Files', file.file_id);

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    let post = await db.insert({ body: body, table: this.table });

    if (post.insertId) {
      cache.setPostAddress(post.insertId, user);
      post = await this.get(post.insertId);
    }

    return post;
  };

  this.get = async (post_id) => {
    if (!/^[0-9]+$/i.test(post_id)) return { errors: { post: 'Invalid ID' } };

    let cachedPost = cache.getTableData(this.table, { field: this.idField, value: post_id });

    if (cachedPost.length > 0) {
      cachedPost[0].user = cache.getPostAddress(cachedPost[0].post_id);

      if (ip.isV4(cachedPost[0].user)) cachedPost[0].user = ip.hashV4(cachedPost[0].user);
      else if (ip.isV6(cachedPost[0].user)) cachedPost[0].user = ip.hashV6(cachedPost[0].user);

      return cachedPost;
    }

    let post = await db.select({
      table: this.table,
      filters: [{ field: this.idField, value: post_id }],
    });

    if (post.length > 0) {
      post[0].file = post[0].file_id ? await this.getFile(post[0].file_id) : null;
      delete post[0].file_id;

      const Thread = require('./Thread');
      Thread.procId = this.procId;
      const thread = await Thread.find({ field: 'thread_id', value: post[0].thread_id });

      const Board = require('./Board');
      Board.procId = this.procId;
      post[0].board = await Board.get(cache.getIdFromHash('Boards', thread[0].board_id));

      const tagged = await tagger.apply(post[0], this.procId);

      post[0].text = tagged.text;

      if (tagged.quoted && tagged.quoted.length > 0)
        post[0].quoted = await Promise.all(
          tagged.quoted.map(async (quoted_id) => (await this.get(quoted_id))[0])
        );

      cache.addTableData(this.table, post[0], false);

      const postUser = cache.getPostAddress(post[0].post_id);

      if (ip.isV4(postUser)) post[0].user = ip.hashV4(postUser);
      else if (ip.isV6(postUser)) post[0].user = ip.hashV6(postUser);
    }

    return post;
  };

  this.getFile = async (file_id) => {
    if (!/^[0-9]+$/i.test(file_id)) return { errors: { post: 'Invalid ID' } };

    File.procId = this.procId;
    return await File.get(file_id);
  };

  this.getAll = async () => {
    const cachedPosts = cache.getTable(this.table);
    if (cachedPosts.length > 0) return cachedPosts;

    let posts = await db.select({
      table: this.table,
      orderBy: { field: 'created_on', direction: 'ASC' },
    });

    await posts.forEach(async (post) => {
      await this.get(post.post_id);
    });

    return cache.getTable(this.table);
  };

  this.find = async (filters) => {
    const cachedPosts = cache.getTableData(this.table, { ...filters });
    if (cachedPosts.length > 0) return cachedPosts;

    let posts = await db.select({
      table: this.table,
      filters: [{ ...filters }],
      orderBy: { field: 'created_on', direction: 'ASC' },
    });

    await posts.forEach(async (post) => {
      await this.get(post.post_id);
    });

    return cache.getTable(this.table);
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'get', 'getFile', 'getAll', 'find'];

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
