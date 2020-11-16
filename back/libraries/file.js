'use strict';

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

const getMimetype = (file) => FILE_SIGNATURES.get(getFileHeader(file)).mimetype;

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

module.exports = { check, getExtension, getMimetype };
