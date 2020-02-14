const jwt = require('jsonwebtoken');
const config = require('../config');

const isStaffAuthorized = req => {
  if (req.staff.disabled) return false;

  if (!req.staff.admin && !req.route.path.includes('auth')) {
    const modPermissionsMap = new Map([
      ['POST', ['bans', 'banners', 'boards', 'rules']],
      ['PUT', ['boards', 'posts', 'reports', 'rules', 'threads']],
      [
        'GET',
        [
          ['bans', 'reports', 'rules'], // [0] con id: /example/:example_id
          ['bans', 'reports'] // [1] sin id: /example
        ]
      ],
      ['DELETE', [['bans', 'banners', 'posts', 'rules', 'threads']]]
    ]);

    const baseRoute = req.route.path.replace(/(:([^\/]+?))\/?$/g, '').replace('/', '');
    const method = req.method;
    const permission = modPermissionsMap.get(req.method);

    if ((method === 'POST' || method === 'PUT') && !permission.includes(baseRoute)) return false;

    if (method === 'GET' || method === 'DELETE') {
      const permIndex = +!req.route.path.includes('id');

      if (!permission[permIndex].includes(baseRoute)) return false;
    }
  }

  return true;
};

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).json('Authorization denied');

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.staff = decoded.staff;

    if (!isStaffAuthorized(req)) return res.status(401).json('Unauthorized');

    return next();
  } catch (error) {
    res.status(401).json('Invalid token');
  }
};
