'use strict';

const validate = require('../libraries/validate');
const thumb = require('../libraries/thumb');

const BaseModel = require('./BaseModel');

function Files() {
  BaseModel.call(this, {
    mimetype: { type: 'string', length: 45, required: true },
    name: { type: 'alphanum', length: 164, required: true },
    extension: { type: 'ext', length: 4, required: true },
    size: { type: 'num', required: true },
    dir: { type: 'dir', length: 20, required: true },
  });

  this.fileSignatures = new Map([
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
}

Files.prototype = Object.create(BaseModel.prototype);
Files.prototype.constructor = Files;

Files.prototype.save = async function (file) {
  const fileExists = this.get([{ field: 'name', value: file.checksum }]);
  if (fileExists.length > 0) return fileExists[0];

  let fileExtension = file.name.split('.').pop().toLowerCase();

  let fileHeader = '';
  switch (fileExtension) {
    case 'mp4':
    case 'm4v': {
      fileHeader = file.data.subarray(4, 12).toString('hex');
      break;
    }

    case 'webp': {
      fileHeader =
        file.data.subarray(0, 4).toString('hex') +
        this.file.data.subarray(8, 12).toString('hex');
      break;
    }

    default: {
      fileHeader = file.data.subarray(0, 4).toString('hex');
      break;
    }
  }

  if (file.truncated || !this.fileSignatures.get(fileHeader))
    return { errors: 'Invalid File' };

  if (!this.fileSignatures.get(fileHeader).extensions.includes(fileExtension))
    fileExtension = fileExtension[0];

  const fileBody = {
    mimetype: this.fileSignatures.get(fileHeader).mimetype,
    name: file.checksum,
    extension: fileExtension,
    size: file.size,
    dir: 'data',
  };

  let errors = validate(fileBody, this);
  if (errors) return [{ errors }];

  try {
    const rootDir = __dirname.split('/').slice(0, -1).join('/');
    const dataDir = `${rootDir}/public/data/`;
    const fileAbsolutePath = `${dataDir}/${file.name}.${file.extension}`;

    await file.mv(fileAbsolutePath);
  } catch (error) {
    errors = error.message;
  }

  if (errors) return { errors };

  const fileThumb = await thumb.make({
    name: fileBody.name,
    ext: fileBody.extension,
  });
  if (!fileThumb) return { errors: 'Could not generate thumb' };

  return await BaseModel.prototype.save.call(this, fileBody);
};

module.exports = Files;
