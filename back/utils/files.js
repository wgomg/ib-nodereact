'use strict';

const config = require('../config/');

const error = require('../utils/error');

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

const acceptedMimeType = (extensions, file) => {
  const fileExtension = file.mimetype.split('/')[1];
  if (!extensions.includes(fileExtension)) return false;

  const header = file.data.subarray(0, 4).toString('hex');
  const fileType = file.mimetype.split('/')[0];
  if (!matchMagicNumber(header, fileExtension, fileType)) return false;

  return true;
};

const processFiles = (
  [required, entry, acceptedExtensions, classname, field, saveEntry, modelInstance],
  callback
) => {
  /*
  example
  
  {
     files: {
      image: {
        name: 'name.jpg',
        data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff e2 02 1c 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 02 0c 6c 63 6d 73 02 10 00 00 ... 84559 more bytes>,
        size: 84609,
        encoding: '7bit',
        tempFilePath: '',
        truncated: false,
        mimetype: 'image/jpeg',
        md5: '5c522ecb401095b699c786f3fe5baba4',
        mv: [Function: mv]
      }
    }

  }
  */

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

module.exports = {
  processFiles
};
