'use strict';

const BaseModel = require('./BaseModel');

const Board = require('./Board');
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

Thread.prototype.saveEntry = function(entry, callback) {
  let newThread = { board_id: entry.board_id, subject: entry.subject };
  let threadOP = { text: entry.text, user: entry.user, name: entry.name, files: entry.files };

  BaseModel.prototype.saveEntry.call(this, newThread, (err, res) => {
    if (err) return callback(err, null);

    threadOP = { ...threadOP, thread_id: res.insertId };
    Post.saveEntry(threadOP, (error, response) => callback(error, res));
  });
};

Thread.prototype.getAllEntries = function(callback, extra) {
  BaseModel.prototype.getAllEntries.call(
    this,
    (err, res) => {
      if (err || res.length === 0) return callback(err, res);

      let threads = [];

      for (let i = 0, length = res.length; i < length; i++)
        Post.getAllEntries(
          (err, response) => {
            if (err) return callback(err, null);

            threads.push({ ...res[i], posts: response });

            if (i + 1 === length) {
              threads.sort((a, b) => {
                if (a.posts.length > 0 && b.posts.length > 0)
                  return (
                    new Date(b.posts[response.length - 1].created_on) -
                    new Date(a.posts[response.length - 1].created_on)
                  );
              });
              return callback(null, threads);
            }
          },
          [{ thread_id: res[i].thread_id }, true]
        );
    },
    extra
  );
};

Thread.prototype.getBoard = async function(filters) {
  if (filters.board_id) return Board.getBoard({ board_id: filters.board_id });
  else {
    const thread = await BaseModel.getEntrySync({ thread_id: filters.thread_id }, 'Threads');
    if (thread[0]) return Board.getBoard({ board_id: thread[0].board_id });
  }

  return [];
};

module.exports = new Thread();
