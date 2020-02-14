'use strict';

const BaseModel = require('./BaseModel');

const Ban = require('./Ban');

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
    file_uri: { type: 'file|png,jpeg,gif', length: 45 }
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
      const post_user = res[0].user;

      if (ip.isV4(post_user)) res[0].user = ip.hashV4(post_user);
      if (ip.isV6(post_user)) res[0].user = ip.hashV6(post_user);
    }

    callback(null, res);
  });
};

// Custom getAllEntries method for hashing user
Post.prototype.getAllEntries = function(callback) {
  BaseModel.prototype.getAllEntries.call(this, (err, res) => {
    if (err) return callback(err, null);

    if (res.length > 0) {
      res = res.map(post => {
        const post_user = post.user;

        if (ip.isV4(post_user)) post.user = ip.hashV4(post_user);
        if (ip.isV6(post_user)) post.user = ip.hashV6(post_user);

        return post;
      });
    }

    callback(null, res);
  });
};

const checkBannedUsers = (user, callback) => {
  Ban.getByUser(user, (err, res) => {
    if (err) callback(err, null);
    else callback(null, [{ banned: res.length > 0 }]);
  });
};

module.exports = new Post();
