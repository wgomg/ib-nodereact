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

  const fileBody = {
    mimetype: file.getMimetype(newFile),
    name: newFile.checksum,
    extension: file.getExtension(newFile),
    size: newFile.size,
    dir: process.env.USERFILES,
  };

  errors = validate(fileBody, this);
  if (errors) return [{ errors }];

  try {
    const rootDir = __dirname.split('/').slice(0, -1).join('/');
    const fileAbsolutePath = `${rootDir}/${process.env.USERFILES}/${fileBody.name}.${fileBody.extension}`;

    await newFile.mv(fileAbsolutePath);
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
