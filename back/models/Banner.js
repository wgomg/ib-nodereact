'use strict';

const BaseModel = require('./BaseModel');

const { processFiles } = require('../utils/files');

const fs = require('fs');
const path = require('path');

function Banner() {
  const classname = 'banner';

  const schema = {
    banner_id: { pk: true },
    board_id: { type: 'table' },
    image_uri: { type: 'file|png,jpeg,gif', length: 120, required: true }
  };

  BaseModel.call(this, classname, schema);
}

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

Banner.prototype.getAllForBoard = function(callback, filters) {
  filters[0].board_id += '|null';
  BaseModel.prototype.getAllEntries.call(
    this,
    (err, res) => {
      if (err) return callback(err, null);

      let resBanners = res;
      if (res.length > 0) {
        resBanners = res.map(banner => {
          const bannerPathArray = banner.image_uri.split('/');
          const bannerExtension = path.extname(banner.image_uri).replace('.', '');

          let resBanner = {
            contentType: bannerPathArray[1] + '/' + bannerExtension,
            data: fs.readFileSync(banner.image_uri)
          };

          return resBanner;
        });
      }

      callback(err, resBanners);
    },
    [...filters, true]
  );
};

module.exports = new Banner();
