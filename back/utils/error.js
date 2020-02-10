'use strict';

const tzoffset = new Date().getTimezoneOffset() * 60000;

module.exports = err => {
  switch (err.code) {
    case 'ECONNREFUSED':
      return {
        code: err.code,
        msg: 'Could no connect to database',
        status: 500,
        date: new Date(Date.now() - tzoffset).toISOString()
      };

    case 'ER_INVALID_ID':
    case 'ER_INVALID_FIELDS':
    case 'ER_INVALID_FILE':
    case 'ER_REQUIRED_FILE':
      return {
        code: err.code,
        msg: err.message,
        status: 400,
        date: new Date(Date.now() - tzoffset).toISOString()
      };

    case 'ENOENT':
      return {
        code: err.code,
        msg: 'No such file or directory: ' + err.path,
        status: 500
      };

    case 'ER_USER_NOTFOUND':
    case 'ER_INVALID_PASS':
      return {
        code: err.code,
        msg: 'Invalid user/password',
        status: 400
      };

    default:
      return {
        code: err.code,
        msg: { sqlMsg: err.sqlMessage, query: err.sql },
        status: 500,
        date: new Date(Date.now() - tzoffset).toISOString()
      };
  }
};
