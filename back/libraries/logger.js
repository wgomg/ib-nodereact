'use strict';

const log4js = require('log4js');
const fs = require('fs');
const config = require('../config').logger;

const levels = {
  ALL: { value: 1, colour: 'grey' },
  CONN: { value: 2, colour: 'green' },
  DEBUG: { value: 3, colour: 'magenta' },
  ERROR: { value: 4, colour: 'red' },
  INFO: { value: 5, colour: 'blue' },
};

const layouts = {
  normal: {
    type: 'pattern',
    pattern: '%[[%d{dd-MM-yyyy hh:mm:ss.SSS O}] [%p]%] %m',
  },
  file: {
    type: 'pattern',
    pattern: '[%d{dd-MM-yyyy hh:mm:ss.SSS O}] %m',
  },
};

let appenders = {
  normal: { type: 'stdout', layout: layouts.normal },
};

let appenderCategories = ['normal'];

const rootDir = __dirname.split('/').slice(0, -1).join('/');
let logsDir = `${rootDir}/${config.dir}`;

if (config.infoFile || config.errorFile || config.debugFile)
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

if (config.infoFile) {
  appenders = {
    ...appenders,
    info_file: { type: 'file', filename: `${logsDir}/app.log`, layout: layouts.file },
    info: { type: 'logLevelFilter', appender: 'info_file', level: 'info', maxLevel: 'info' },
  };
  appenderCategories.push('info');
}

if (config.errorFile) {
  appenders = {
    ...appenders,
    error_file: { type: 'file', filename: `${logsDir}/error.log`, layout: layouts.file },
    error: { type: 'logLevelFilter', appender: 'error_file', level: 'error', maxLevel: 'error' },
  };
  appenderCategories.push('error');
}

if (config.debugFile) {
  appenders = {
    ...appenders,
    debug_file: { type: 'file', filename: `${logsDir}/debug.log`, layout: layouts.file },
    debug: { type: 'logLevelFilter', appender: 'debug_file', level: 'debug', maxLevel: 'debug' },
  };
  appenderCategories.push('debug');
}

log4js.configure({
  levels,
  appenders,
  categories: {
    default: {
      appenders: appenderCategories,
      level: 'all',
      enableCallStack: true,
    },
  },
});

const logger = log4js.getLogger();

logger.level = config.level;

module.exports = {
  info: (message, procId) => {
    let msg = '';
    if (procId !== 'server') msg += `[${procId}] `;
    msg += message;

    logger.info(msg);
  },

  stream: {
    write: (message) => {
      logger.info(message.replace('\n', ''));
    },
  },

  error: (err) => {
    if (err instanceof Error) logger.error(err.stack || err);
    else logger.error(err);
  },

  debug: (data, procId, type) => {
    switch (type) {
      case 'method':
        let dataStr = '';

        if (data.data)
          dataStr =
            'data: ' +
            JSON.stringify(data.data, (key, value) =>
              key === 'user' || key === 'files' || key === 'password' || key === 'data'
                ? typeof value
                : value
            );

        logger.debug(`[${procId}] Call on ${data.name}, ${dataStr}`);
        break;

      case 'dbop':
        logger.debug(`[${procId}] DB: Attempt to ${data.name} ${JSON.stringify(data.data)}`);
        break;

      default:
        logger.debug(data);
        break;
    }
  },

  connection: (message) => {
    logger.conn(message);
  },
};
