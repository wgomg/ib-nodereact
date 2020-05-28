'use strict';

const bcrypt = require('bcrypt');

const db = require('../db');
const logger = require('../libraries/logger');
const validate = require('../libraries/validate');
const jwt = require('../libraries/jwt');

const cache = require('../libraries/cache');

const Board = require('./Board');

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

  this.save = async (body) => {
    logger.debug({ name: `${this.name}.save()`, data: body }, this.procId, 'method');

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    body.password = bcrypt.hashSync(body.name, 10);

    let staff = await db.insert({ body, table: this.table }, this.procId);

    if (staff.insertId) {
      staff = await db.select(
        { table: this.table, filters: [{ field: this.idField, value: staff.insertId }] },
        this.procId
      );

      let board = [];
      if (staff.board_id) {
        Board.procId = this.procId;
        board = await Board.getByID(staff.board_id);

        delete staff.board_id;
      }

      staff.board = board.length > 0 ? board[0] : null;
      delete staff.password;
    }

    return staff;
  };

  // TODO: chequear solo un staff pueda actualizar su propios datos, y admins
  this.update = (body) => {
    logger.debug({ name: `${this.name}.update()`, data: body }, this.procId, 'method');

    if (body.password) delete body.password;

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    const cachedId = cache.getKeyInObject(this.table, idValue);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { staff: 'Invalid ID' } };

    return db.update(
      { body, table: this.table, id: { field: this.idField, value: cachedId } },
      this.procId
    );
  };

  // TODO: chequear solo un staff pueda actualizar su propios datos, y admins
  this.updatePassword = (body) => {
    logger.debug({ name: `${this.name}.updatePassword()`, data: body }, this.procId, 'method');

    const idValue = body[this.idField];
    delete body[this.idField];

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    const cachedId = cache.getKeyInObject(this.table, idValue);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { staff: 'Invalid ID' } };

    body.password = bcrypt.hashSync(body.password, 10);

    return db.update(
      { body, table: this.table, id: { field: this.idField, value: cachedId } },
      this.procId
    );
  };

  this.getAuth = async (staff) => {
    if (staff) {
      logger.debug({ name: `${this.name}.getAuth()`, data: staff }, this.procId, 'method');

      const cachedId = cache.getKeyInObject(this.table, staff.staff_id);
      if (!/^[0-9]+$/i.test(cachedId)) return { errors: { staff: 'Invalid ID' } };

      let res = await this.get(staff.staff_id);

      if (res.length > 0) {
        res = {
          staff_id: staff.staff_id,
          name: res[0].name,
          admin: res[0].admin,
          board_id: res[0].board_id,
          disabled: res[0].disabled,
        };

        res.board_id = cache.setHashId('Boards', res.board_id, 'dbData');
      }

      return res;
    }

    return { errors: { auth: 'Authorization denied' } };
  };

  this.get = async (staff_id) => {
    logger.debug({ name: `${this.name}.get()`, data: staff_id }, this.procId, 'method');

    const cachedId = cache.getKeyInObject(this.table, staff_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { staff: 'Invalid ID' } };

    const staff = await db.select(
      {
        table: this.table,
        filters: [{ field: this.idField, value: cachedId }],
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
      return Promise.all(
        staffs.map(async (staff) => {
          let board = [];
          if (staff.board_id) {
            Board.procId = this.procId;
            board = await Board.getByID(staff.board_id);

            delete staff.board_id;
          }

          staff.staff_id = cache.setHashId(this.table, staff.staff_id, 'dbData');

          return staff;
        })
      );

    return staffs;
  };

  this.sLogin = async (body) => {
    logger.debug({ name: `${this.name}.sLogin()`, data: body }, this.procId, 'method');

    const res = await db.select(
      { table: this.table, filters: [{ field: 'name', value: body.name }] },
      this.procId
    );

    if (res.length === 0) return { errors: { user: 'Not Found' } };

    const passwordMatch = bcrypt.compareSync(body.password, res[0].password);
    if (!passwordMatch) return { errors: { password: 'Invalid password' } };

    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const now = (tzoffset) => new Date(Date.now() - tzoffset).toISOString();

    let staff = {
      staff_id: res[0].staff_id,
      name: res[0].name,
      last_login: now(tzoffset).slice(0, 19).replace('T', ' '),
    };

    await this.update(staff);

    staff = { ...staff, ...res[0] };

    staff.staff_id = cache.setHashId(this.table, staff.staff_id, 'dbData');

    if (staff.board_id) staff.board_id = cache.getValueInObject('Boards', res[0].board_id);

    return [{ token: jwt.set(staff) }];
  };

  this.delete = (staff_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: staff_id }, this.procId, 'method');

    const cachedId = cache.getKeyInObject(this.table, staff_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { staff: 'Invalid ID' } };

    return db.remove({ table: this.table, id: { field: this.idField, value: cachedId } });
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
