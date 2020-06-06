'use strict';

const bcrypt = require('bcrypt');

const db = require('../db');

const logger = require('../libraries/logger');
const validate = require('../libraries/validate');
const jwt = require('../libraries/jwt');

const cache = require('../libraries/cache');

function Staff() {
  this.name = this.constructor.name;
  this.table = this.name + 's';
  this.idField = this.name.toLowerCase() + '_id';

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

    body = {
      ...body,
      password: bcrypt.hashSync(body.name, 10),
      board_id: cache.getIdFromHash('Boards', body.board_id),
    };

    const errors = validate(body, this.schema);
    if (errors) return { errors };

    let staff = await db.insert({ body, table: this.table });

    if (staff.insertId) {
      staff = await db.select({
        table: this.table,
        filters: [{ field: this.idField, value: staff.insertId }],
      });

      if (staff.length > 0) {
        staff[0].board_id = staff[0].board_id ? cache.getHash('Boards', staff[0].board_id) : null;

        cache.addTableData(this.table, staff[0]);

        staff = cache.getTableData(this.table, { field: 'staff_id', value: staff[0].staff_id });
        delete staff[0].password;
      }
    }

    return staff;
  };

  this.sLogin = async (body) => {
    logger.debug({ name: `${this.name}.sLogin()`, data: body }, this.procId, 'method');

    let staff = cache.getTableData(this.table, { field: 'name', value: body.name });

    if (staff.length === 0)
      staff = await db.select({ table: this.table, filters: [{ field: 'name', value: body.name }] });
    else staff[0].staff_id = cache.getIdFromHash(this.table, staff[0].staff_id);

    if (staff.length === 0) return { errors: { user: 'Not Found' } };

    const passwordMatch = bcrypt.compareSync(body.password, staff[0].password);
    if (!passwordMatch) return { errors: { password: 'Invalid password' } };

    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const now = (tzoffset) => new Date(Date.now() - tzoffset).toISOString();

    const updateStaff = {
      last_login: now(tzoffset).slice(0, 19).replace('T', ' '),
    };

    await db.update({
      body: updateStaff,
      table: this.table,
      id: { field: this.idField, value: staff[0].staff_id },
    });

    staff = await db.select({ table: this.table, filters: [{ field: 'name', value: body.name }] });

    if (staff[0].board_id) staff[0].board_id = cache.getHash('Boards', staff[0].board_id);

    cache.upateTableData(this.table, staff[0]);

    staff = cache.getTableData(this.table, { field: this.idField, value: staff[0].staff_id });

    return [{ token: jwt.set(staff[0]) }];
  };

  this.getAuth = async (staff) => {
    if (staff) {
      logger.debug({ name: `${this.name}.getAuth()`, data: staff }, this.procId, 'method');

      const cachedId = cache.getIdFromHash(this.table, staff.staff_id);
      if (!/^[0-9]+$/i.test(cachedId)) return { errors: { staff: 'Invalid ID' } };

      staff = cache.getTableData(this.table, { field: this.idField, value: cachedId });

      if (staff.length === 0)
        staff = await db.select({
          table: this.table,
          filters: [{ field: this.idField, value: cachedId }],
        });

      if (staff.length > 0) {
        if (/^[0-9]+$/i.test(staff[0].staff_id)) {
          staff[0].board_id = staff[0].board_id ? cache.getHash('Boards', staff[0].board_id) : null;
          cache.addTableData(this.table, staff[0]);
        }

        staff = cache.getTableData(this.table, { field: this.idField, value: cachedId });

        staff = {
          staff_id: staff[0].staff_id,
          name: staff[0].name,
          admin: staff[0].admin,
          board_id: staff[0].board_id,
          disabled: staff[0].disabled,
        };
      }

      return staff;
    }

    return { errors: { auth: 'Authorization denied' } };
  };

  this.getAll = async () => {
    logger.debug({ name: `${this.name}.getAll()` }, this.procId, 'method');

    let cachedStaffs = cache.getTable(this.table);

    if (cachedStaffs.length > 0) {
      cachedStaffs = cachedStaffs.map((staff) => {
        delete staff.password;
        return staff;
      });

      return cachedStaffs;
    }

    let staffs = await db.select({ table: this.table });
    if (staffs.length > 0) {
      staffs = staffs.map((staff) => {
        staff.board_id = staff.board_id ? cache.getHash('Boards', staff.board_id) : null;

        return staff;
      });
    }
    cache.setTable(this.table, staffs);

    staffs = cache.getTable(this.table);
    staffs = staffs.map((staff) => {
      delete staff.password;
      return staff;
    });

    return staffs;
  };

  this.delete = async (staff_id) => {
    logger.debug({ name: `${this.name}.delete()`, data: staff_id }, this.procId, 'method');

    const cachedId = cache.getIdFromHash(this.table, staff_id);
    if (!/^[0-9]+$/i.test(cachedId)) return { errors: { staff: 'Invalid ID' } };

    const res = await db.remove({ id: { field: this.idField, value: cachedId }, table: this.table });

    if (res.affectedRows > 0) cache.removeFromTable(this.table, staff_id);

    return res;
  };

  this.getFunctions = () => {
    const FN_ARGS = /([^\s,]+)/g;
    const excluded = ['getFunctions'];

    const functions = Object.entries(this)
      .filter(([key, val]) => typeof val === 'function' && !excluded.includes(key))
      .map(([fnName, fnDef]) => {
        const fnStr = fnDef.toString();
        const fnArgs = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(FN_ARGS);

        return { name: fnName, args: fnArgs };
      });

    return functions;
  };
}

module.exports = new Staff();
