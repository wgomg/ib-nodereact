'use strict';

const fs = require('fs');

const crypto = require('crypto');

const util = require('util');
const child_process = require('child_process');

const spawn = util.promisify(child_process.exec);

const FILE_SIGNATURES = new Map([
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

const check = (file) => {
  if (file.truncated) return { errors: 'File size too big' };

  if (!FILE_SIGNATURES.get(getFileHeader(file)))
    return { errors: 'Invalid File' };

  return false;
};

const getExtension = (file) => {
  let fileExtension = file.name.split('.').pop().toLowerCase();

  if (
    !FILE_SIGNATURES.get(getFileHeader(file)).extensions.includes(fileExtension)
  )
    return fileExtension[0];

  return fileExtension;
};

const saveToDisk = async (file, ext) => {
  try {
    const rootDir = __dirname.split('/').slice(0, -1).join('/');
    const fileAbsolutePath = `${rootDir}/${process.env.USERFILES}/${file.md5}.${ext}`;

    await file.mv(fileAbsolutePath);
  } catch (error) {
    return { errors: error.message };
  }

  return false;
};

const getMimetype = (file) => FILE_SIGNATURES.get(getFileHeader(file)).mimetype;

const purgeMetadata = async (name, ext) => {
  const rootDir = __dirname.split('/').slice(0, -1).join('/');
  const fileAbsolutePath = `${rootDir}/${process.env.USERFILES}/${name}.${ext}`;

  if (!fs.existsSync(fileAbsolutePath))
    throw new Error(`File doesn't exists: ${fileAbsolutePath}`);

  try {
    await spawn(`mat2 --inplace ${fileAbsolutePath}`);
  } catch (error) {
    throw new Error(error);
  }

  return true;
};

const getSize = (name, ext) => {
  const rootDir = __dirname.split('/').slice(0, -1).join('/');
  const fileAbsolutePath = `${rootDir}/${process.env.USERFILES}/${name}.${ext}`;

  if (!fs.existsSync(fileAbsolutePath))
    throw new Error(`File doesn't exists: ${fileAbsolutePath}`);

  const fileStats = fs.statSync(fileAbsolutePath);

  return fileStats.size;
};

const getName = (currName, ext, checksum) => {
  const rootDir = __dirname.split('/').slice(0, -1).join('/');
  const fileCurrPath = `${rootDir}/${process.env.USERFILES}/${currName}.${ext}`;

  if (!fs.existsSync(fileCurrPath))
    throw new Error(`File doesn't exists: ${fileCurrPath}`);

  const fileBuffer = fs.readFileSync(fileCurrPath);
  const newName = crypto.createHash(checksum).update(fileBuffer).digest('hex');

  const fileNewPath = fileCurrPath.replace(currName, newName);

  try {
    fs.renameSync(fileCurrPath, fileNewPath);
  } catch (error) {
    throw new Error(error);
  }

  return newName;
};

const getFileHeader = (file) => {
  let fileExtension = file.name.split('.').pop().toLowerCase();

  switch (fileExtension) {
    case 'mp4':
    case 'm4v':
      return file.data.subarray(4, 12).toString('hex');

    case 'webp':
      return (
        file.data.subarray(0, 4).toString('hex') +
        this.file.data.subarray(8, 12).toString('hex')
      );

    default:
      return file.data.subarray(0, 4).toString('hex');
  }
};

module.exports = {
  check,
  getExtension,
  saveToDisk,
  purgeMetadata,
  getSize,
  getName,
  getMimetype,
};
