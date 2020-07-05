'use strict';

const config = require('../config/').files;
const thumb = require('./thumb');

const signaturesMap = new Map([
  ['89504e47', { mimetype: 'image/png', extensions: ['png'] }],
  ['47494638', { mimetype: 'image/gif', extensions: ['gif'] }],
  ['ffd8ffe0', { mimetype: 'image/jpeg', extensions: ['jpg', 'jpeg'] }],
  ['ffd8ffe1', { mimetype: 'image/jpeg', extensions: ['jpg'] }],
  ['ffd8ffe2', { mimetype: 'image/jpeg', extensions: ['jpeg'] }],
  ['ffd8ffe3', { mimetype: 'image/jpeg', extensions: ['jpeg'] }],
  ['ffd8ffe8', { mimetype: 'image/jpeg', extensions: ['jpg'] }],
  ['25504446', { mimetype: 'application/pdf', extensions: ['pdf'] }],
  ['667479704d534e56', { mimetype: 'video/mp4', extensions: ['mp4'] }],
  ['6674797069736f6d', { mimetype: 'video/mp4', extensions: ['mp4'] }],
  ['667479706d703432', { mimetype: 'video/mp4', extensions: ['m4v', 'mp4'] }],
  ['1a45dfa3', { mimetype: 'video/webm', extensions: ['webm'] }],
  ['5249464657454250', { mimetype: 'image/webp', extensions: ['webp'] }],
]);

const rootDir = __dirname.split('/').slice(0, -1).join('/');
const dataDir = `${rootDir}/public/${config.data.dir}/`;

function AllowedFile(file) {
  this.file = file;

  let fileExtension = this.file.name.split('.').pop().toLowerCase();
  let fileHeader = this.file.data.subarray(0, 4).toString('hex');

  if (fileExtension === 'mp4' || fileExtension === 'm4v')
    fileHeader = this.file.data.subarray(4, 12).toString('hex');

  if (fileExtension === 'webp')
    fileHeader =
      this.file.data.subarray(0, 4).toString('hex') + this.file.data.subarray(8, 12).toString('hex');

  this.schemaData = {
    mimetype: null,
    name: null,
    extension: null,
    size: null,
    folder: null,
  };

  this.error = null;

  if (this.file.truncated || signaturesMap.get(fileHeader) === undefined) this.error = 'Invalid File';
  else {
    const extensions = signaturesMap.get(fileHeader).extensions;
    if (!extensions.includes(fileExtension)) fileExtension = extensions[0];

    this.schemaData = {
      mimetype: signaturesMap.get(fileHeader).mimetype,
      name: this.file.md5,
      extension: fileExtension,
      size: this.file.size,
      folder: config.data.dir,
    };
  }

  this.saveToDisk = async () => {
    const fileAbsolutePath = `${dataDir}/${this.schemaData.name}.${this.schemaData.extension}`;

    if (this.error) return this.error;

    try {
      await this.file.mv(fileAbsolutePath);
      this.error = null;
    } catch (error) {
      this.error = error.message;
    }
  };

  this.generateThumb = async () => {
    const fileThumb = await thumb.make({ name: this.schemaData.name, ext: this.schemaData.extension });
    this.error = fileThumb ? null : 'Could not generate thumb';
  };
}

module.exports = AllowedFile;
