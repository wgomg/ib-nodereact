'use strict';

const validate = require('../libraries/validate');
const file = require('../libraries/file');
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
}

Files.prototype = Object.create(BaseModel.prototype);
Files.prototype.constructor = Files;

Files.prototype.save = async function (newFile) {
  const fileExists = this.get([{ field: 'name', value: newFile.checksum }]);
  if (fileExists.length > 0) return fileExists[0];

  let errors = file.check(newFile);
  if (errors) return { errors };

  const fileExtension = file.getExtension(newFile);
  let newFileSize = null;
  let newFileName = null;

  try {
    errors = await file.saveToDisk(newFile, fileExtension);

    if (process.env.FILES_PURGE_METADATA === 'true')
      await file.purgeMetadata(newFile.md5, fileExtension);

    newFileSize = await file.getSize(newFile.md5, fileExtension);
    newFileName = await file.getName(
      newFile.md5,
      fileExtension,
      process.env.FILES_CHECKSUM_ALG,
    );
  } catch (error) {
    file.removeFromDisk(newFileName ? newFileName : newFile.md5, fileExtension);

    return { error: 'Could not save file' };
  }

  let fileBody = {
    mimetype: file.getMimetype(newFile),
    size: newFileSize,
    name: newFileName,
    dir: process.env.FILES_STOREPATH,
    extension: fileExtension,
  };

  errors = validate(fileBody, this);
  if (errors) return [{ errors }];

  const fileThumb = await thumb.make({
    name: fileBody.name,
    ext: fileBody.extension,
  });
  if (!fileThumb) return { errors: 'Could not generate thumb' };

  return await BaseModel.prototype.save.call(this, fileBody);
};

module.exports = Files;
