'use strict';

const jwt = require('../libraries/jwt');

const auth = (access, Staffs) => {
  return async (req, res, next) => {
    const authToken = req.header('x-auth-token');

    if (access === 'none' || !authToken)
      return res.status(401).json('Access denied');

    try {
      req.staff_id = jwt.decode(authToken);
      req.parentBoard = req.header('x-parent-collection');

      if (!isStaffAuthorized(req, access, Staffs))
        return res.status(401).json('Unauthorized');

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json('Invalid token');
    }
  };
};

const isStaffAuthorized = async (req, access, Staffs) => {
  const staff_id = req.staff_id;

  let staff = await Staffs.get([{ field: 'staff_id', value: staff_id }]);
  if (staff.length === 0) return false;

  staff = staff[0];

  if (staff.disabled) return false;
  if (access === 'admin' && !staff.admin) return false;
  if (staff.board_id !== req.parentBoard) return false;

  return true;
};

module.exports = auth;
