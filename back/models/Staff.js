'use strict';

const bcrypt = require('bcrypt');

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');
const jwt = require('../libraries/jwt');

function Staff() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.table.toLowerCase().slice(0, -1) + '_id';

  this.procId = null;

  this.schema = {
    board_id: { type: 'table' },
    name: { type: 'alpha', length: 15, required: true },
    password: { type: 'alphanum', length: 20 },
    admin: { type: 'bool' },
    disabled: { type: 'bool' },
    last_login: { type: 'timestamp' },
  };

  this.save = (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema);
    if (errors) return { validationError: errors };

    body.password = bcrypt.hashSync(body.name, 10);

    return db.insert({ body, table: this.table }, this.procId);
  };

  // TODO: chequear solo un staff pueda actualizar su propios datos, y admins
  this.update = (body) => {
    logger.debug({ name: `${this.name}.update()`, data: body }, this.procId, 'method');

    if (body.password) delete body.password;

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { validationError: errors };

    return db.update(
      { body, table: this.table, id: { field: this.idField, value: idValue } },
      this.procId
    );
  };

  // TODO: chequear solo un staff pueda actualizar su propios datos, y admins
  this.updatePassword = (body) => {
    logger.debug({ name: `${this.name}.updatePassword()`, data: body }, this.procId, 'method');

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { validationError: errors };

    body.password = bcrypt.hashSync(body.name, 10);

    return db.update(
      { body, table: this.table, id: { field: this.idField, value: idValue } },
      this.procId
    );
  };

  this.get = async (staff_id) => {
    logger.debug({ name: `${this.name}.get()`, data: staff_id }, this.procId);

    const staff = await db.select(
      {
        table: this.table,
        filters: [{ field: this.idField, value: staff_id }],
      },
      this.procId
    );

    if (staff.length > 0) delete staff[0].password;

    return staff;
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    let staffs = await db.select({ table: this.table }, this.procId);

    if (staffs.length > 0)
      staffs = staffs.map((staff) => {
        delete staff.password;
        return staff;
      });

    return staffs;
  };

  this.sLogin = async (body) => {
    logger.debug({ name: `${this.name}.sLogin()`, data: body }, this.procId);

    const res = await db.select(
      { table: this.table, filters: [{ field: name, value: body.name }] },
      this.procId
    );

    if (res.length === 0) return { validationError: { user: 'Not Found' } };

    const passwordMatch = bcrypt.compareSync(body.password, res[0].password);
    if (!passwordMatch) return { validationError: { password: 'Invalid password' } };

    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const now = (tzoffset) => new Date(Date.now() - tzoffset).toISOString();

    const staff = {
      staff_id: res[0].staff_id,
      name: res[0].name,
      last_login: now(tzoffset).slice(0, 19).replace('T', ' '),
    };

    const updatedLogin = await this.update(staff);

    if (updatedLogin[0].affectedRows > 0) return { token: jwt.set(updatedLogin[0]) };

    return [];
  };

  this.getAuth = async (staff) => {
    logger.debug({ name: `${this.name}.getAuth()`, data: staff.staff_id }, this.procId);

    let res = await this.get(staff.staff_id);

    if (res.length > 0)
      res = {
        staff_id: res[0].staff_id,
        name: res[0].name,
        admin: res[0].admin,
        disabled: res[0].disabled,
      };

    return res;
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;

    const functions = Object.entries(this)
      .filter(([key, val]) => typeof val === 'function' && key !== 'getFunctions')
      .map(([fnName, fnDef]) => {
        const fnStr = fnDef.toString();
        const fnArgs = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(FN_ARGS);

        return { name: fnName, args: fnArgs };
      });

    return functions;
  };
}

module.exports = new Staff();
