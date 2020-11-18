'use strict';

const fs = require('fs');

const util = require('util');
const child_process = require('child_process');

const spawn = util.promisify(child_process.exec);

const rootDir = __dirname.split('/').slice(0, -1).join('/');
const thumbDir = `${rootDir}/${process.env.FILES_THUMB_STOREPATH}`;

const make = async ({ name, ext }) => {
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir);

  let thumbsize =
    ext === 'gif'
      ? process.env.FILES_THUMB_GIF_DIM
      : process.env.FILES_THUMB_DIM;

  try {
    let filePath = `${process.env.FILES_STOREPATH}/${name}.${ext}`;
    const thumbPath = `${thumbDir}/${name}.${getThumbExt(ext)}`;

    if (!fs.existsSync(thumbPath))
      await spawn(getCmd(ext, filePath, thumbPath, thumbsize));

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const get = async (name, ext, folder) => {
  if (folder === 'default') return `default/${name}.${ext}`;

  return fs.existsSync(`${thumbDir}/${name}.${getThumbExt(ext)}`)
    ? `${thumbDir}/thumbs/${name}.${getThumbExt(ext)}`
    : 'not-found';
};

const getCmd = (ext, filePath, thumbPath, thumbSize) => {
  switch (ext) {
    case 'pdf':
      return `convert ${filePath}[0] -auto-orient -thumbnail ${thumbSize} -unsharp 0x.5 -background white +smush 20 -bordercolor white -border 10 ${thumbPath}`;

    case 'mp4':
    case 'm4v':
    case 'webm':
      return `ffmpeg -ss 1 -i ${filePath} -vframes 1 -filter:v 'yadif,scale=-1:240' ${thumbPath}`;

    default:
      return `convert ${filePath} -define jpeg:size=500x500 -auto-orient -thumbnail ${thumbSize} -unsharp 0x.5 ${thumbPath}`;
  }
};

const getThumbExt = (ext) =>
  ext === 'pdf' || ext === 'mp4' || ext === 'm4v' || ext === 'webm'
    ? 'png'
    : ext;

module.exports = { make, get };
