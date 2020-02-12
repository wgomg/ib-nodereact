'use strict';

const config = require('../config/');

const error = require('../utils/error');

const crypto = require('crypto');

/*** */

const isIPv4 = ip => /\d+\.\d+(\.\d+)?(\.\d+)?/.test(ip);

const isIPv6 = ip => /([0-9a-f]{1,4}:){1,7}[0-9a-f]{1,4}/.test(ip);

/**
 * schema validation types
 *
 * alpha: string letters only
 * alphanum: string letters and numbers
 * string: string letters, numbers and special chars
 * email: email
 *
 * bool: boolean or [0, 1]
 *
 * ip_address: ipv4 or ipv6
 *
 */
const isValidDatatype = (value, type) => {
  switch (type) {
    case 'alpha':
      return /^[a-z]+$/i.test(value);

    case 'alphanum':
      return /^[a-z0-9 ]+$/i.test(value);

    case 'email':
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      );

    case 'string':
      return typeof value === 'string';

    case 'bool':
      return typeof value === 'boolean' || value == 1 || value == 0;

    case 'ip_address':
      return isIPv4(value) || isIPv6(value);

    default:
      return false;
  }
};

const processNestedResults = ([table, results, foreignTable]) => {
  let processedResults = [];
  let processedIds = [];

  for (let i = 0, length = results.length; i < length; i++) {
    const row = results[i];
    let entry = row[table];

    const generatedColumns = Object.keys(results[0]).filter(key => key === '');

    if (generatedColumns.length > 0) {
      for (let i = 0, length = generatedColumns.length; i < length; i++) {
        const gendFields = row[generatedColumns[i]];
        const genFieldsMap = new Map(Object.entries(gendFields));

        for (const [field, value] of genFieldsMap) {
          entry[field] = value;
          delete row[generatedColumns[i]];
        }
      }
    }

    const idField = table.toLowerCase().slice(0, -1) + '_id';

    if (foreignTable !== undefined) {
      const foreignTableColumnKey = foreignTable.toLowerCase().slice(0, -1) + '_id';

      entry[foreignTable] = row[foreignTable];
      delete entry[foreignTableColumnKey];
    }

    if (!processedIds.includes(entry[idField])) {
      if (foreignTable !== undefined) entry[foreignTable] = [entry[foreignTable]];

      processedResults.push(entry);
      processedIds.push(entry[idField]);
    } else {
      processedResults.map(res => {
        if (res[idField] === entry[idField]) {
          if (foreignTable !== undefined) {
            const foreignTableColumnKey = foreignTable.toLowerCase().slice(0, -1) + '_id';

            if (
              !res[foreignTable].some(
                obj => obj[foreignTableColumnKey] === entry[foreignTable][foreignTableColumnKey]
              )
            )
              res[foreignTable].push(entry[foreignTable]);
          }
        }
      });
    }
  }

  return processedResults;
};

const hasFileField = modelSchema => {
  for (const field in modelSchema)
    if (!modelSchema[field].pk && modelSchema[field].type.includes('file')) return true;

  return false;
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

  if (required && filesNum.length === 0)
    callback(
      error({
        code: 'ER_REQUIRED_FILE',
        message: 'No required file provided'
      }),
      null
    );
  else if (Object.keys(files).length > 0) {
    for (let [index, file] of Object.entries(files)) {
      const fileType = file.mimetype.split('/')[0];

      if (!acceptedMimeType(acceptedExtensions, file) || file.truncated)
        callback(
          error({
            code: 'ER_INVALID_FILE',
            message: 'Provided file type is invalid or exceeds size limit'
          }),
          null
        );
      else {
        const fileName = file.md5;
        const fileExtension = file.mimetype.split('/')[1];

        const fileRelativePath = `${data_dir}/${fileType}/${classname}/${fileName}.${fileExtension}`;
        const fileAbsolutePath = root_dir + fileRelativePath;

        file.mv(fileAbsolutePath, err => {
          if (err) callback(err, null);
          else {
            entry[field] = fileRelativePath;

            delete entry.files;

            saveEntry.call(modelInstance, entry, (err, res) => callback(err, res));
          }
        });
      }
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

const haship = (str, len) => {
  const md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('base64').substring(0, len);
};

const hashIPv4 = ip => {
  let parts = ip.split('.');
  let acc = '';

  parts = parts.map((segment, i) => {
    const part = haship(acc + segment + i, 3);
    acc += segment;
    return part;
  });

  while (parts.length < 4) parts.push('*');

  return parts.join('.');
};

const hashIPv6 = (str, len) => {
  let parts = ip.split(':');
  parts.splice(4, 4);
  let acc = '';

  parts = parts.map((segment, i) => {
    const part = iphash(acc + segment + i, 4);
    acc += segment;
    return part;
  });

  while (parts.length < 4) parts.push('*');
  return parts.join(':');
};

module.exports = {
  isValidDatatype,
  processNestedResults,
  hasFileField,
  processFiles,
  isIPv4,
  isIPv6,
  hashIPv4,
  hashIPv6
};
