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
    has_ban: { type: 'bool' },
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

      const fileBanned = await Ban.isFileBanned(files[0].md5);
      if (fileBanned) return { errors: { file: 'File is banned' } };

      file = await File.save(files[0]);
    }

    if (file && file.errors) return { errors: file.errors };

    delete body.files;

    if (file) body.file_id = cache.getIdFromHash('Files', file.file_id);

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    let post = await db.insert({ body: body, table: this.table });

    if (post.insertId) {
      cache.setPostUser(post.insertId, user);
      post = await this.get(post.insertId);
    }

    return post;
  };

  this.get = async (post_id) => {
    if (!/^[0-9]+$/i.test(post_id)) return { errors: { post: 'Invalid ID' } };

    let cachedPost = cache.getTableData(this.table, { field: this.idField, value: post_id });

    if (cachedPost.length > 0) {
      cachedPost[0].user = cache.getPostUser(cachedPost[0].post_id);

      if (cachedPost[0].user) {
        if (ip.isV4(cachedPost[0].user.ipaddress))
          cachedPost[0].user.ipaddress = ip.hashV4(cachedPost[0].user.ipaddress);
        else if (ip.isV6(cachedPost[0].user.ipaddress))
          cachedPost[0].user.ipaddress = ip.hashV6(cachedPost[0].user.ipaddress);
      }

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

      const postUser = cache.getPostUser(post[0].post_id);

      if (postUser) {
        if (ip.isV4(postUser.ipaddress))
          post[0].user = { ...postUser, ipaddress: ip.hashV4(postUser.ipaddress) };
        else if (ip.isV6(postUser.ipaddress))
          post[0].user = { ...postUser, ipaddress: ip.hashV6(postUser.ipaddress) };
      }
    }

    return post;
  };

  this.getFile = async (file_id) => {
    if (!/^[0-9]+$/i.test(file_id)) return { errors: { post: 'Invalid ID' } };

    File.procId = this.procId;
    return await File.get(file_id);
  };

  this.getAll = async () => {
    let cachedPosts = cache.getTable(this.table);
    if (cachedPosts.length > 0) {
      cachedPosts = cachedPosts.map((post) => {
        post.user = cache.getPostUser(post.post_id);

        if (post.user) {
          if (ip.isV4(post.user.ipaddress)) post.user.ipaddress = ip.hashV4(post.user.ipaddress);
          else if (ip.isV6(post.user.ipaddress)) post.user.ipaddress = ip.hashV6(post.user.ipaddress);
        }

        return post;
      });

      return cachedPosts;
    }

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
    let cachedPosts = cache.getTableData(this.table, { ...filters });
    if (cachedPosts.length > 0) {
      cachedPosts = cachedPosts.map((post) => {
        const postUser = cache.getPostUser(post.post_id);

        if (postUser) {
          if (ip.isV4(postUser.ipaddress))
            post.user = { ...postUser, ipaddress: ip.hashV4(postUser.ipaddress) };
          else if (ip.isV6(postUser.ipaddress))
            post.user = { ...postUser, ipaddress: ip.hashV6(postUser.ipaddress) };
        }

        return post;
      });

      return cachedPosts;
    }

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

  this.update = async (body) => {
    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    let post = await db.update({ body, table: this.table, id: { field: this.idField, value: idValue } });

    if (post.changedRows > 0) {
      const File = require('./File');
      File.procId = this.procId;
      const file = await File.get(body.file_id);

      cache.updateTableData(this.table, { has_ban: body.has_ban, file, [this.idField]: idValue }, false);
      post = await this.get(idValue);
    }

    return post;
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions', 'get', 'getFile', 'getAll', 'find', 'update'];

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
