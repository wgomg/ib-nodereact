'use strict';

const models = require('../models');

const jwt = require('../libraries/jwt');

let privateRoutesMap = null;

const modPermissionsMap = new Map([
  ['Ban', ['save']],
  ['Banner', ['save', 'delete']],
  ['Board', ['update']],
  ['Post', ['update', 'delete']],
  ['Report', ['updateSolved']],
  ['Rule', ['save', 'update', 'delete']],
  ['Thread', ['delete']],
]);

const auth = (routes) => {
  privateRoutesMap = routes;

  return async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json('Authorization denied');

    try {
      req.staff = jwt.decode(token);

      const isStaffAuthorized = await checkStaffAuthorization(req);
      if (!isStaffAuthorized) return res.status(401).json('Unauthorized');

      return next();
    } catch (error) {
      console.error(error);
      res.status(401).json('Invalid token');
    }
  };
};

const checkStaffAuthorization = async (req) => {
  const staff = req.staff;

  if (staff.disabled) return false;

  const route = req.route.path;
  if (!staff.admin && privateRoutesMap.has(route)) {
    const modelMethod = privateRoutesMap.get(route).split('.');

    /**
     * modelMethod[0] = model name
     * modelMethod[1] = model method
     * ej.: [ 'Board', 'delete' ]
     * */
    if (!modPermissionsMap.has(modelMethod[0])) return false;

    if (!modPermissionsMap.get(modelMethod[0]).includes(modelMethod[1])) return false;

    const staffIsBoardModerator = await checkStaffBoard(
      req.body || req.params || null,
      staff,
      modelMethod
    );
    if (!staffIsBoardModerator) return false;
  }

  return true;
};

const checkStaffBoard = async (reqData, staff, modelMethod) => {
  const Model = models[modelMethod[0]];
  const idField = modelName.idField;

  let args = [];
  if (reqData) args.push(reqData[idField]);

  let board_id = null;
  if (idField === 'board_id') board_id = reqData[idField];
  else board_id = await Model.getBoardId(...args);

  if (!board_id || (board_id && board_id !== staff.board_id)) return false;

  return true;
};

module.exports = auth;
