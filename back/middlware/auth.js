const jwt = require('jsonwebtoken');
const config = require('../config');
const models = require('../models');

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).json('Authorization denied');

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.staff = decoded.staff;

    const isStaffAuthorized = await checkStaffAuthorization(req);

    if (!isStaffAuthorized) return res.status(401).json('Unauthorized');

    return next();
  } catch (error) {
    console.error(error);
    res.status(401).json('Invalid token');
  }
};

const checkStaffAuthorization = async req => {
  const staff = req.staff;

  if (staff.disabled) return false;

  if (!staff.admin && !req.route.path.includes('auth')) {
    const modPermissionsMap = new Map([
      ['POST', ['bans', 'banners', 'boards', 'rules']],
      ['PUT', ['boards', 'posts', 'reports', 'rules', 'threads']],
      [
        'GET',
        [
          [], // [0] con id: /example/:example_id
          ['reports'] // [1] sin id: /example
        ]
      ],
      ['DELETE', [['banners', 'posts', 'rules', 'threads'], []]]
    ]);

    const baseRoute = req.route.path.replace(/(:([^\/]+?))\/?$/g, '').replace(/\//g, '');
    const method = req.method;
    const permission = modPermissionsMap.get(req.method);
    const staffIsBoardModerator = await checkStaffBoard(req.body || req.params, staff, baseRoute);

    if (
      (method === 'POST' || method === 'PUT') &&
      (!permission.includes(baseRoute) || !staffIsBoardModerator)
    )
      return false;

    if (method === 'GET' || method === 'DELETE') {
      const permIndex = +!req.route.path.includes('id');
      if (!permission[permIndex].includes(baseRoute) || !staffIsBoardModerator) return false;
    }
  }

  return true;
};

const checkStaffBoard = async (reqData, staff, baseRoute) => {
  const modelName = baseRoute.slice(0, 1).toUpperCase() + baseRoute.slice(1, -1);
  const Model = models[modelName];
  const idField = modelName.toLowerCase() + '_id';

  const board = await Model.getBoard({ [idField]: reqData[idField] });

  if (board.length === 0 || (staff.board_id && board[0].board_id !== staff.board_id)) return false;

  return true;
};

module.exports = auth;
