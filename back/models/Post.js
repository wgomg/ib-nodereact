'use strict';

const BaseModel = require('./BaseModel');

const Ban = require('./Ban');
const Thread = require('./Thread');

const ip = require('../utils/ip');

const { processFiles } = require('../utils/files');

function Post() {
  const classname = 'post';

  const schema = {
    post_id: { pk: true },
    thread_id: { type: 'table', required: true },
    text: { type: 'string', length: 1000, required: true },
    user: { type: 'ip_address', required: true },
    name: { type: 'alphanum', length: 10 },
    file_uri: { type: 'file|png,jpeg,gif', length: 120 }
  };

  BaseModel.call(this, classname, schema);
}

Post.prototype = Object.create(BaseModel.prototype);

// Custom saveEntry method for handling files uploading
Post.prototype.saveEntry = function(entry, callback) {
  const acceptedExtensions = this._schema.file_uri.type.split('|')[1].split(',');
  const required = this._schema.file_uri.required;

  checkBannedUsers(entry.user, (err, res) => {
    if (err || res[0].banned) return callback(err, res);

    processFiles(
      [required, entry, acceptedExtensions, 'posts', 'file_uri', BaseModel.prototype.saveEntry, this],
      (err, res) => callback(err, res)
    );
  });
};

// Custom getEntry method for hashing user
Post.prototype.getEntry = function([filters], callback) {
  BaseModel.prototype.getEntry.call(this, [filters], (err, res) => {
    if (err) return callback(err, null);

    if (res.length > 0) {
      if (ip.isV4(res[0].user)) res[0].user = ip.hashV4(res[0].user);
      if (ip.isV6(res[0].user)) res[0].user = ip.hashV6(res[0].user);
    }

    callback(null, res);
  });
};

// Custom getAllEntries method for hashing user
Post.prototype.getAllEntries = function(callback, extra) {
  const filters = extra ? [...extra] : [null, null];

  BaseModel.prototype.getAllEntries.call(
    this,
    (err, res) => {
      if (err) return callback(err, null);

      if (res.length > 0) {
        res = res.map(post => {
          if (ip.isV4(post.user)) post.user = ip.hashV4(post.user);
          if (ip.isV6(post.user)) post.user = ip.hashV6(post.user);

          return post;
        });
      }

      callback(null, res);
    },
    [...filters, { field: 'created_on', direction: 'ASC' }]
  );
};

Post.prototype.getAllLatests = function(callback) {
  BaseModel.prototype.getAllEntries.call(
    this,
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res.slice(0, 10));
    },
    [null, null, { field: 'created_on', direction: 'DESC' }]
  );
};

Post.prototype.getBoard = async function(filters) {
  if (filters.thread_id) return Thread.getBoard({ thread_id: filters.thread_id });
  else {
    const post = await BaseModel.getEntrySync({ post_id: filters.post_id }, 'Posts');
    if (post[0]) return Thread.getBoard({ thread_id: post[0].thread_id });
  }

  return [];
};

const checkBannedUsers = (user, callback) => {
  Ban.getByUser(user, (err, res) => {
    if (err) callback(err, null);
    else callback(null, [{ banned: res.length > 0 }]);
  });
};

module.exports = new Post();
