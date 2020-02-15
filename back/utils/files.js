'use strict';

const config = require('../config/');

const error = require('../utils/error');

const processFiles = (
  [required, entry, acceptedExtensions, classname, field, saveEntry, modelInstance],
  callback
) => {
  const { root_dir, data_dir } = config.server;

  const files = entry.files || {};
  const filesNum = Object.keys(files).filter(file => files[file].size > 0);

  if (required && filesNum.length === 0) return callback(error({ code: 'ER_REQUIRED_FILE' }), null);

  if (Object.keys(files).length > 0) {
    for (let [index, file] of Object.entries(files)) {
      const fileType = file.mimetype.split('/')[0];

      if (!acceptedMimeType(acceptedExtensions, file) || file.truncated)
        return callback(error({ code: 'ER_INVALID_FILE' }), null);

      const fileName = file.md5;
      const fileExtension = file.mimetype.split('/')[1];

      const fileRelativePath = `${data_dir}/${fileType}/${classname}/${fileName}.${fileExtension}`;
      const fileAbsolutePath = root_dir + fileRelativePath;

      file.mv(fileAbsolutePath, err => {
        if (err) return callback(err, null);

        entry[field] = fileRelativePath;
        delete entry.files;
        saveEntry.call(modelInstance, entry, (err, res) => callback(err, res));
      });
    }
  } else {
    delete entry.files;
    saveEntry.call(modelInstance, entry, (err, res) => callback(err, res));
  }
};

const acceptedMimeType = (extensions, file) => {
  const fileExtension = file.mimetype.split('/')[1];
  if (!extensions.includes(fileExtension)) return false;

  const header = file.data.subarray(0, 4).toString('hex');
  const fileType = file.mimetype.split('/')[0];
  if (!matchMagicNumber(header, fileExtension, fileType)) return false;

  return true;
};

const matchMagicNumber = (header, extension, fileType) => {
  const numbers = {
    image: {
      png: ['89504e47'],
      gif: ['47494638'],
      jpeg: ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe3']
    }
  };

  if (Object.keys(numbers).includes(fileType)) {
    const typeExtensions = numbers[fileType];
    if (Object.keys(typeExtensions).includes(extension)) {
      const typeNumbers = typeExtensions[extension];
      if (typeNumbers.includes(header)) return true;
    }
  }

  return false;
};

module.exports = {
  processFiles
};
