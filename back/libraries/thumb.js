'use strict';

const config = require('../config/files.json').data;

const logger = require('../libraries/logger');

const fs = require('fs');

const util = require('util');
const child_process = require('child_process');

const spawn = util.promisify(child_process.exec);

const rootDir = __dirname.split('/').slice(0, -1).join('/');
const dataDir = `${rootDir}/public/${config.dir}`;
const thumbDir = `${dataDir}/thumbs`;

const make = async ({ name, ext }) => {
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir);

  let thumbsize = '280x280';
  if (ext === 'gif') thumbsize = '150x150';

  try {
    let filePath = `${dataDir}/${name}.${ext}`;
    const thumbPath = `${thumbDir}/${name}.${getThumbExt(ext)}`;

    if (!fs.existsSync(thumbPath)) {
      let cmd = `convert ${filePath} -define jpeg:size=500x500 -auto-orient -thumbnail ${thumbsize} -unsharp 0x.5 ${thumbPath}`;

      if (ext === 'pdf') cmd = pdfCmd(filePath, thumbPath);
      if (ext === 'mp4' || ext === 'm4v' || ext === 'webm') cmd = videoCmd(filePath, thumbPath);

      await spawn(cmd);
    }

    return true;
  } catch (error) {
    logger.debug(error);
    return false;
  }
};

const videoCmd = (filePath, thumbPath) =>
  `ffmpeg -ss 1 -i ${filePath} -vframes 1 -filter:v 'yadif,scale=-1:240' ${thumbPath}`;

const pdfCmd = (filePath, thumbPath) =>
  `convert ${filePath}[0] -auto-orient -thumbnail 280x280 -unsharp 0x.5 -background white +smush 20 -bordercolor white -border 10 ${thumbPath}`;

const get = async (name, ext) =>
  fs.existsSync(`${thumbDir}/${name}.${getThumbExt(ext)}`)
    ? `${config.dir}/thumbs/${name}.${getThumbExt(ext)}`
    : 'not-found';

const getThumbExt = (ext) =>
  ext === 'pdf' || ext === 'mp4' || ext === 'm4v' || ext === 'webm' ? 'png' : ext;

module.exports = { make, get };
