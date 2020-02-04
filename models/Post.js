'use strict';

const BaseModel = require('./BaseModel');

const { processFiles } = require('../utils/helpers');

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
    file_uri: { type: 'file|pdf,png,jpg,jpeg,gif,webm,mp4', length: 45 }
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

module.exports = new Post();
