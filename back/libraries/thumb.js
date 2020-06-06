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
    const thumbPath = `${thumbDir}/${name}.${ext === 'pdf' ? 'png' : ext}`;

    if (!fs.existsSync(thumbPath)) {
      let args = [
        '-define jpeg:size=500x500',
        filePath + (ext === 'pdf' ? '[0]' : ''),
        '-auto-orient',
        `-thumbnail ${thumbsize}`,
        '-unsharp 0x.5',
      ];

      if (ext === 'pdf')
        args = [...args, '-background white +smush 20', '-bordercolor white', '-border 10'];

      args.push(thumbPath);

      await spawn('convert ' + args.join(' '));
    }

    return true;
  } catch (error) {
    logger.debug(error);
    return false;
  }
};

const get = async (name, ext) =>
  fs.existsSync(`${thumbDir}/${name}.${ext === 'pdf' ? 'png' : ext}`)
    ? `${config.dir}/thumbs`
    : 'not-found';

module.exports = { make, get };
