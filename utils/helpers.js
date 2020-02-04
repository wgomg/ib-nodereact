'use strict';

const config = require('../config/');

const error = require('../utils/error');

const isIp = require('is-ip');

/**
 * schema validation types
 *
 * alpha: string letters only
 * alphanum: string letters and numbers
 * string: string letters, numbers and special chars
 * email: email
 *
 * int: integer
 * bool: boolean or [0, 1]
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
      return isIp(value);

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
        name: '',
        data: <Buffer >,
        size: 0,
        encoding: '7bit',
        tempFilePath: '/tmp/tmp-3-1580587211235',
        truncated: false,
        mimetype: 'text/plain',
        md5: 'd41d8cd98f00b204e9800998ecf8427e',
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
  else if (files.length > 0) {
    for (let [index, file] of Object.entries(files)) {
      const fileType = file.mimetype.split('/')[0];
      const fileExtension = file.mimetype.split('/')[1];

      if (!acceptedExtensions.includes(fileExtension) || file.truncated)
        callback(
          error({
            code: 'ER_INVALID_FILE',
            message: 'Provided file type is invalid or exceeds size limit'
          }),
          null
        );
      else {
        const fileName = file.tempFilePath.split('-')[2];

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

module.exports = {
  isValidDatatype,
  processNestedResults,
  hasFileField,
  processFiles
};
