'use strict';

const signaturesMap = new Map([
  ['89504e47', { mimetype: 'image/png', extensions: ['png'] }],
  ['47494638', { mimetype: 'image/gif', extensions: ['gif'] }],
  ['ffd8ffe0', { mimetype: 'image/jpeg', extensions: ['jpg', 'jpeg'] }],
  ['ffd8ffe1', { mimetype: 'image/jpeg', extensions: ['jpg'] }],
  ['ffd8ffe2', { mimetype: 'image/jpeg', extensions: ['jpeg'] }],
  ['ffd8ffe3', { mimetype: 'image/jpeg', extensions: ['jpeg'] }],
  ['ffd8ffe8', { mimetype: 'image/jpeg', extensions: ['jpg'] }],
]);

function AllowedFile(file) {
  if (!file) this.noFile = true;

  const fileHeader = file.data.subarray(0, 4).toString('hex');

  if (file.truncated || signaturesMap.get(fileHeader) === undefined) this.invalidFile = true;
  else {
    let fileExtension = file.name.split('.').pop().toLowerCase();
    const extensions = signaturesMap.get(fileHeader).extensions;
    if (!extensions.includes(fileExtension)) fileExtension = extensions[0];

    this.mimetype = signaturesMap.get(fileHeader).mimetype;
    this.name = file.md5;
    this.extension = fileExtension;
    this.size = file.size;
  }
}

module.exports = AllowedFile;
