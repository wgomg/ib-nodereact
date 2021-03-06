'use strict';

const BaseModel = require('./BaseModel');

function Threads() {
  BaseModel.call(
    this,
    {
      board_id: { type: 'int', required: true },
      subject: {
        type: 'string',
        regex: '^([a-zA-Z0_9 ])',
        minlength: 4,
        maxlength: 45,
        required: true
      }
    },
    false
  );
}

Threads.prototype = Object.create(BaseModel.prototype);
Threads.prototype.constructor = Threads;

Threads.prototype.getPosts = async function (thread_id) {
  thread_id = this.getEntryId(thread_id);

  if (!thread_id) return { errors: { [this.name]: 'Invalid ID' } };

  const Posts = new (require('./Posts'))();

  return (await Posts.get([{ field: this.idField, value: thread_id }])).map(
    (post) => {
      delete post.thread_id;
      return post;
    }
  );
};

module.exports = Threads;
