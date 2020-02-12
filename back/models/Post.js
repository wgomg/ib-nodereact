'use strict';

const BaseModel = require('./BaseModel');

const { processFiles, isIPv4, isIPv6, hashIPv4, hashIPv6 } = require('../utils/helpers');

/**
 * Constructor for Post model
 */
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

// Inherit methods from BaseModel parent class
Post.prototype = Object.create(BaseModel.prototype);

// Custom saveEntry method for handling files uploading
Post.prototype.saveEntry = function(entry, callback) {
  const acceptedExtensions = this._schema.file_uri.type.split('|')[1].split(',');
  const required = this._schema.file_uri.required;

  processFiles(
    [required, entry, acceptedExtensions, 'posts', 'file_uri', BaseModel.prototype.saveEntry, this],
    (err, res) => callback(err, res)
  );
};

// Custom getEntry method for hashing user
Post.prototype.getEntry = function([filters], callback) {
  BaseModel.prototype.getEntry.call(this, [filters], (err, res) => {
    if (err) callback(err, null);
    else {
      if (res.length > 0) {
        const post_user = res[0].user;

        if (isIPv4(post_user)) res[0].user = hashIPv4(post_user);
        if (isIPv6(post_user)) res[0].user = hashIPv6(post_user);
      }

      callback(null, res);
    }
  });
};

// Custom getAllEntries method for hashing user
Post.prototype.getAllEntries = function(callback) {
  BaseModel.prototype.getAllEntries.call(this, (err, res) => {
    if (err) callback(err, null);
    else {
      if (res.length > 0) {
        res = res.map(post => {
          const post_user = post.user;

          if (isIPv4(post_user)) post.user = hashIPv4(post_user);
          if (isIPv6(post_user)) post.user = hashIPv6(post_user);

          return post;
        });
      }

      callback(null, res);
    }
  });
};

module.exports = new Post();
