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
  ['Staff', ['getAuth', 'get', 'updateChangepassword']],
  ['Thread', ['delete']],
]);

const auth = (routes) => {
  privateRoutesMap = routes;

  return async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json('Authorization denied');

    try {
      req.staff = jwt.decode(token);
      req.procId = genProcId();

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

  if (!staff.admin && privateRoutesMap.has(req.method + route)) {
    const modelMethod = privateRoutesMap.get(req.method + route).split('.');

    /**
     * modelMethod[0] = model name
     * modelMethod[1] = model method
     * ej.: [ 'Board', 'delete' ]
     * */
    if (!modPermissionsMap.has(modelMethod[0])) return false;

    if (!modPermissionsMap.get(modelMethod[0]).includes(modelMethod[1])) return false;

    let reqData = null;
    if (Object.keys(req.body).length > 0) reqData = req.body;
    else if (Object.keys(req.params).length > 0) reqData = req.params;

    if (modelMethod[0] !== 'Staff') {
      const staffIsBoardModerator = await checkStaffBoard(reqData, staff, modelMethod, req.procId);
      if (!staffIsBoardModerator) return false;
    }

    return true;
  }

  return true;
};

const checkStaffBoard = async (reqData, staff, modelMethod, procId) => {
  const Model = models[modelMethod[0]];
  const idField = Model.idField;
  Model.procId = procId;

  let board_id = null;

  if (idField === 'board_id') board_id = reqData[idField];
  else if (reqData.board_id) board_id = reqData.board_id;
  else board_id = await Model.getBoardId(reqData[idField]);

  if (!board_id || (board_id && board_id !== staff.board_id)) return false;

  return true;
};

const genProcId = () => Math.random().toString(20).substr(2, 6);

module.exports = auth;
