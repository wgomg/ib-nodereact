'use strict';

const BaseModel = require('./BaseModel');

const Board = require('./Board');
const Post = require('./Post');

const error = require('../utils/error');

const fs = require('fs');
const path = require('path');

function Thread() {
  const classname = 'thread';

  const schema = {
    thread_id: { pk: true },
    board_id: { type: 'table', required: true },
    subject: { type: 'alphanum', length: 45, required: true },
    file_uri: { type: 'file|png,jpeg,gif', length: 120 }
  };

  BaseModel.call(this, classname, schema);
}

Thread.prototype = Object.create(BaseModel.prototype);

Thread.prototype.saveEntry = function(entry, callback) {
  if (entry.files === null) return callback(error({ code: 'ER_INVALID_FIELDS' }), null);

  let newThread = { board_id: entry.board_id, subject: entry.subject };
  let threadOP = { text: entry.text, user: entry.user, name: entry.name, files: entry.files };

  BaseModel.prototype.saveEntry.call(this, newThread, (err, res) => {
    if (err) return callback(err, null);

    threadOP = { ...threadOP, thread_id: res[0].insertId };

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

            let posts = [];

            if (response.length > 0)
              posts = response.map(post => {
                if (post.file_uri) {
                  const filePathArray = post.file_uri.split('/');
                  const fileExtension = path.extname(post.file_uri).replace('.', '');

                  const resFile = {
                    post_id: post.post_id,
                    text: post.text,
                    user: post.user,
                    name: post.name,
                    created_on: post.created_on,
                    file: {
                      contentType: filePathArray[1] + '/' + fileExtension,
                      // data: fs.readFileSync(post.file_uri),
                      uri: post.file_uri,
                      name: post.file_name,
                      size: post.file_size
                    }
                  };

                  return resFile;
                }

                return post;
              });

            threads.push({ ...res[i], posts: posts });

            if (i + 1 === length) {
              threads.sort((a, b) => {
                if (a.posts.length > 0 && b.posts.length > 0)
                  return (
                    new Date(b.posts[b.posts.length - 1].created_on) -
                    new Date(a.posts[a.posts.length - 1].created_on)
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

Thread.prototype.getEntry = function([filters], callback) {
  BaseModel.prototype.getEntry.call(this, [filters], (err, res) => {
    if (err) return callback(err, null);

    let thread = { ...res[0] };

    Post.getAllEntries(
      (err, response) => {
        if (err) return callback(err, null);

        let posts = [];

        if (response.length > 0)
          posts = response.map(post => {
            if (post.file_uri) {
              const filePathArray = post.file_uri.split('/');
              const fileExtension = path.extname(post.file_uri).replace('.', '');

              const resFile = {
                post_id: post.post_id,
                text: post.text,
                user: post.user,
                name: post.name,
                created_on: post.created_on,
                file: {
                  contentType: filePathArray[1] + '/' + fileExtension,
                  data: fs.readFileSync(post.file_uri),
                  name: post.file_name,
                  size: post.file_size
                }
              };

              return resFile;
            }

            return post;
          });

        thread.posts = posts;

        callback(null, thread);
      },
      [{ thread_id: thread.thread_id }]
    );
  });
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
