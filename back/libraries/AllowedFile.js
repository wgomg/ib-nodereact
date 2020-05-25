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
]);

const rootDir = __dirname.split('/').slice(0, -1).join('/');
const dataDir = `${rootDir}/public/${config.data.dir}/`;

function AllowedFile(file) {
  this.file = file;

  const fileHeader = this.file.data.subarray(0, 4).toString('hex');

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
    let fileExtension = this.file.name.split('.').pop().toLowerCase();
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
    this.error = fileThumb ? null : 'Could generate thumb';
  };
}

module.exports = AllowedFile;
