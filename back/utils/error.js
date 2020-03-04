'use strict';

const tzoffset = new Date().getTimezoneOffset() * 60000;

const now = tzoffset => new Date(Date.now() - tzoffset).toISOString();

module.exports = err => {
  switch (err.code) {
    case 'ECONNREFUSED':
      return {
        code: err.code,
        msg: 'Could no connect to database',
        status: 500,
        date: now(tzoffset)
      };

    case 'ER_INVALID_ID':
    case 'ER_INVALID_FIELDS':
      return {
        code: err.code,
        msg: 'There are invalid fields, please check them and try again',
        status: 400,
        date: now(tzoffset)
      };

    case 'ER_REQUIRED_FILE':
      return {
        code: err.code,
        msg: 'No required file provided',
        status: 400,
        date: now(tzoffset)
      };

    case 'ER_INVALID_FILE':
      return {
        code: err.code,
        msg: 'Provided file type is invalid or file exceeds size limit',
        status: 400,
        date: now(tzoffset)
      };

    case 'ENOENT':
      return {
        code: err.code,
        msg: 'No such file or directory: ' + err.path,
        status: 500,
        date: now(tzoffset)
      };

    case 'ER_USER_NOTFOUND':
    case 'ER_INVALID_PASS':
      return {
        code: err.code,
        msg: 'Invalid user/password',
        status: 400,
        date: now(tzoffset)
      };

    default:
      return {
        code: err.code,
        msg: err.sqlMessage,
        query: err.sql,
        status: 500,
        date: now(tzoffset)
      };
  }
};
