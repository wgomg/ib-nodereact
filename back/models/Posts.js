'use strict';

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

  const Files = new (require('./Files'))();

  return await Promise.all(
    posts.map(async (post) => {
      post.file = await Files.get([{ field: 'file_id', value: post.file_id }]);
      delete post.file_id;

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

  return latests;
};

module.exports = Posts;
