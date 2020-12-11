'use strict';

const file = require('../libraries/file');
const thumb = require('../libraries/thumb');

const BaseModel = require('./BaseModel');

function Files() {
  BaseModel.call(this, {
    mimetype: { type: 'string', length: 45, required: true },
    name: { type: 'string', length: 164, required: true },
    extension: {
      type: 'string',
      regex: '^([a-z4])',
      minlength: 3,
      maxlength: 4,
      required: true
    },
    size: { type: 'int', required: true },
    dir: {
      type: 'string',
      maxlength: 30,
      required: true
    }
  });
}

Files.prototype = Object.create(BaseModel.prototype);
Files.prototype.constructor = Files;

Files.prototype.preprocess = async function (newFile) {
  const fileExists = this.get([{ field: 'name', value: newFile.checksum }]);
  if (fileExists.length > 0) return fileExists[0];

  let errors = file.check(newFile);
  if (errors) return { errors };

  const fileExtension = file.getExtension(newFile);
  let newFileSize = null;
  let newFileName = null;

  let ret = null;

  try {
    errors = await file.saveToDisk(newFile, fileExtension);

    if (process.env.FILES_PURGE_METADATA === 'true')
      await file.purgeMetadata(newFile.md5, fileExtension);

    newFileSize = await file.getSize(newFile.md5, fileExtension);
    newFileName = await file.getName(
      newFile.md5,
      fileExtension,
      process.env.FILES_CHECKSUM_ALG
    );

    const fileBody = {
      mimetype: file.getMimetype(newFile),
      size: newFileSize,
      name: newFileName,
      dir: process.env.FILES_STOREPATH,
      extension: fileExtension
    };

    await thumb.make({
      name: fileBody.name,
      ext: fileBody.extension
    });

    ret = { ...fileBody };
  } catch (error) {
    file.removeFromDisk(newFileName ? newFileName : newFile.md5, fileExtension);

    ret = { error: 'Could not save file' };
  }

  return ret;
};

Files.prototype.save = async function (fileBody) {
  return await BaseModel.prototype.save.call(this, fileBody);
};

module.exports = Files;
