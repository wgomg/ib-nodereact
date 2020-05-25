'use strict';

const config = require('../config/files.json').data;

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
    const filePath = `${dataDir}/${name}.${ext}`;
    const thumbPath = `${thumbDir}/${name}.${ext}`;

    if (!fs.existsSync(thumbPath)) {
      const args = [
        '-define jpeg:size=500x500',
        filePath,
        '-auto-orient',
        `-thumbnail ${thumbsize}`,
        '-unsharp 0x.5',
        thumbPath,
      ];

      await spawn('convert ' + args.join(' '));
    }

    return true;
  } catch (error) {
    return false;
  }
};

const get = async (name, ext) =>
  fs.existsSync(`${thumbDir}/${name}.${ext}`) ? `${config.dir}/thumbs` : 'not-found';

module.exports = { make, get };
