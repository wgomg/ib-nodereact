'use strict';

const BaseModel = require('./BaseModel');

const Post = require('./Post');

function Thread() {
  const classname = 'thread';

  const schema = {
    thread_id: { pk: true },
    board_id: { type: 'table', required: true },
    subject: { type: 'alphanum', length: 45 }
  };

  BaseModel.call(this, classname, schema);
}

Thread.prototype = Object.create(BaseModel.prototype);

Thread.prototype.getAllEntries = function(callback, extra) {
  BaseModel.prototype.getAllEntries.call(
    this,
    (err, res) => {
      if (err || res.length === 0) return callback(err, res);

      let threads = [];

      for (let i = 0, length = res.length, thread = res[i]; i < length; i++)
        Post.getAllEntries(
          (err, res) => {
            if (err) return callback(err, null);

            thread.posts = res;
            threads.push(thread);

            if (i + 1 === length) {
              threads.sort(
                (a, b) =>
                  new Date(b.posts[res.length - 1].created_on) -
                  new Date(a.posts[res.length - 1].created_on)
              );
              return callback(null, threads);
            }
          },
          [{ thread_id: thread.thread_id }, true]
        );
    },
    extra
  );
};

module.exports = new Thread();
