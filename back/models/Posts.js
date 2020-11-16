'use strict';

const markdown = require('../libraries/markdown');
const BaseModel = require('./BaseModel');

function Posts() {
  BaseModel.call(
    this,
    {
      thread_id: { type: 'table', required: true },
      text: { type: 'string', length: 3000, required: true },
      name: { type: 'alphanum', length: 10 },
      file_id: { type: 'table' },
      has_ban: { type: 'bool' },
    },
    false
  );
}

Posts.prototype = Object.create(BaseModel.prototype);
Posts.prototype.constructor = Posts;

Posts.prototype.get = async function (filters, fields) {
  let posts = await BaseModel.prototype.get.call(this, filters, fields);

  const Tags = new (require('./Tags'))();
  const tags = await Tags.get();

  return await Promise.all(
    posts.map(async (post) => {
      post.file = await this.getFile(post.file_id);
      delete post.file_id;

      post.text = markdown.tags(post.text, tags);

      return post;
    })
  );
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
        { field: 'thread_id', value: post.thread_id },
      ]);

      const Board = new Boards();
      const board = await Board.get([
        { field: 'board_id', value: thread[0].board_id },
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
  return await Files.get([{ field: 'file_id', value: file_id }]);
};

module.exports = Posts;
