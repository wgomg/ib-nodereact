'use strict';

const BaseModel = require('./BaseModel');

const { processFiles } = require('../utils/helpers');

/**
 * Constructor for Banner model
 */
function Banner() {
  const classname = 'banner';

  const schema = {
    banner_id: { pk: true },
    board_id: { type: 'table' },
    image_uri: { type: 'file|png,jpg,jpeg,gif', length: 45, required: true }
  };

  BaseModel.call(this, classname, schema);
}

// Inherit methods from BaseModel parent class
Banner.prototype = Object.create(BaseModel.prototype);

// Custom saveEntry method for handling images uploading
Banner.prototype.saveEntry = function(entry, callback) {
  const acceptedExtensions = this._schema.image_uri.type.split('|')[1].split(',');
  const required = this._schema.image_uri.required;

  processFiles(
    [required, entry, acceptedExtensions, 'banners', 'image_uri', BaseModel.prototype.saveEntry, this],
    (err, res) => callback(err, res)
  );
};

module.exports = new Banner();
