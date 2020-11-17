'use strict';

const commandExistsSync = require('command-exists').sync;

module.exports = () => {
  if (!commandExistsSync('mysql')) throw new Error('mysql is not installed');

  if (!commandExistsSync('ffmpeg')) throw new Error('ffmpeg is not installed');

  if (!commandExistsSync('convert'))
    throw new Error('convert is not installed');

  if (process.env.DELETE_FILE_METADATA && !commandExistsSync('mat2'))
    throw new Error('matt2 is not installed');
};
