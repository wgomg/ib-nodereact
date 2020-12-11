'use strict';

const cache = require('../libraries/cache');
const markdown = require('../libraries/markdown');
const BaseModel = require('./BaseModel');

function Posts() {
  BaseModel.call(
    this,
    {
      thread_id: { type: 'int', required: true },
      text: { type: 'string', minlength: 5, maxlength: 3000, required: true },
      name: {
        type: 'string',
        regex: '^([a-zA-Z0-9 ])',
        minlength: 3,
        maxlength: 10
      },
      file_id: { type: 'int' },
      has_ban: { type: 'bool' },
      video_url: {
        type: 'string',
        regex:
          '^(http(s)?:\\/\\/)?((w){3}.)?(streamable|dai(.ly|lymotion)|vimeo|youtu(be|.be))?(\\.com)?\\/.+'
      }
    },
    false
  );
}

Posts.prototype = Object.create(BaseModel.prototype);
Posts.prototype.constructor = Posts;

Posts.prototype.get = async function (filters, fields) {
  let posts = await BaseModel.prototype.get.call(this, filters, fields);

  const Threads = require('./Threads');
  const Boards = require('./Boards');

  const Tags = new (require('./Tags'))();
  const tags = await Tags.get();

  const Settings = new (require('./Settings'))();
  const settings = await Settings.get([
    { field: 'name', value: 'fe_uri_format' }
  ]);

  posts = await Promise.all(
    posts.map(async (post) => {
      post.file = await this.getFile(post.file_id);
      delete post.file_id;

      const Thread = new Threads();
      const thread = await Thread.get([
        { field: 'thread_id', value: post.thread_id }
      ]);

      const Board = new Boards();
      const board = await Board.get([
        { field: 'board_id', value: thread[0].board_id }
      ]);

      delete thread[0].board_id;
      delete post.thread_id;

      post.text = markdown.sanitizeInPostHTML(post.text);
      post.text = markdown.ibLinks(post, settings, board[0], thread[0]);
      post.text = markdown.tags(post.text, tags);
      post.text = markdown.restoreInPostHTML(post.text);

      return { ...post, user: cache.getPostUser(post.post_id) ?? 'expired' };
    })
  );

  return posts;
};

Posts.prototype.getLatests = async function () {
  const latests = await this.rawQuery(
    `SELECT * FROM Posts ` +
      `WHERE created_on = ` +
      `(SELECT MAX(created_on) FROM Posts latest WHERE thread_id = Posts.thread_id) ` +
      `ORDER BY created_on DESC LIMIT 10`
  );

  const Threads = require('./Threads');
  const Boards = require('./Boards');

  const Tags = new (require('./Tags'))();
  const tags = await Tags.get();

  return await Promise.all(
    latests.map(async (post) => {
      post.file = await this.getFile(post.file_id);
      delete post.file_id;

      const Thread = new Threads();
      const thread = await Thread.get([
        { field: 'thread_id', value: post.thread_id }
      ]);

      const Board = new Boards();
      const board = await Board.get([
        { field: 'board_id', value: thread[0].board_id }
      ]);

      delete thread[0].board_id;
      delete post.thread_id;

      post.text = markdown.tags(post.text, tags);

      return { board: board[0], thread: thread[0], post };
    })
  );
};

Posts.prototype.getFile = async function (file_id) {
  const Files = new (require('./Files'))();
  let file = await Files.get([{ field: 'file_id', value: file_id }]);

  if (file.length > 0) file[0].thumbDir = process.env.FILES_THUMB_STOREPATH;

  return file;
};

module.exports = Posts;
