'use strict';

const bcrypt = require('bcrypt');
const jwt = require('../libraries/jwt');

const BaseController = require('./BaseController');

function Staffs() {
  BaseController.call(this);
}

Staffs.prototype = Object.create(BaseController.prototype);
Staffs.prototype.constructor = Staffs;

Staffs.prototype.save = BaseController.prototype.routeFunction(
  { http: 'POST', auth: { required: true, access: 'admin' } },
  async function (body) {
    Object.entries(body).forEach(([field, value]) => {
      ({ field, value } = this.replaceHashIdFieldsWithDbId({
        field,
        value,
      }));

      body[field] = value;
    });

    const Staffs = this.model;

    const validationErrors = Staffs.validate(body);
    if (validationErrors) return { data: validationErrors };

    body = {
      ...body,
      password: bcrypt.hashSync(body.password, 10),
    };

    const staff = await Staffs.save(body);

    return { data: staff ? staff[0] : null };
  }
);

Staffs.prototype.getAll = BaseController.prototype.routeFunction(
  { http: 'GET', auth: { required: true, access: 'admin' } },
  async function () {
    let staffs = await this.get();

    staffs = staffs.map((staff) => {
      delete staff.password;
      return staff;
    });

    return { data: staffs };
  }
);

Staffs.prototype.changePassword = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false },
  },
  async function (staff_id, body) {
    let staff = await this.get([{ field: 'name', value: body.name }]);

    if (staff.length > 0 && staff_id !== staff[0].staff_id)
      return { data: { error: { staff: 'Unauthorized' } } };

    Object.entries(body).forEach(([field, value]) => {
      ({ field, value } = this.replaceHashIdFieldsWithDbId({
        field,
        value,
      }));

      body[field] = value;
    });

    const oldEntry = (
      await this.get([{ field: this.idField, value: body[this.idField] }])
    )[0];

    const Staffs = this.model;

    delete body[Staffs.idField];

    delete oldEntry[Staffs.idField];
    delete oldEntry.created_on;

    const validationErrors = Staffs.validate(body);
    if (validationErrors) return { data: validationErrors };

    body = {
      ...body,
      password: bcrypt.hashSync(body.password, 10),
    };

    staff = await Staffs.update(body);

    return { data: staff ? staff[0] : null };
  }
);

Staffs.prototype.newLogin = BaseController.prototype.routeFunction(
  { http: 'PUT', auth: { required: false } },
  async function (body) {
    let staff = await this.get([{ field: 'name', value: body.name }]);

    if (staff.length === 0) return { data: { error: { user: 'Not Found' } } };

    const passwordMatch = bcrypt.compareSync(body.password, staff[0].password);
    if (!passwordMatch) return { data: { error: { password: 'Invalid' } } };

    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const now = (tzoffset) => new Date(Date.now() - tzoffset).toISOString();

    body = {
      ...body,
      last_login: now(tzoffset).slice(0, 19).replace('T', ' '),
    };

    staff = await this.update(body);

    if (!staff)
      return {
        data: { error: { login: 'Something went wrong, please try again' } },
      };

    staff = await this.get([{ field: 'staff_id', value: staff[0].staff_id }]);

    return { data: { token: jwt.set(staff[0]) } };
  }
);

Staffs.prototype.getAuth = BaseController.prototype.routeFunction(
  { http: 'GET', auth: { required: true, access: 'staff' } },
  async function (staff) {
    staff = await this.model.get([{ field: 'staff_id', value: staff }]);

    if (staff.length === 0) return { data: { error: { staff: 'Not Found' } } };

    delete staff.password;
    delete staff.created_on;

    return { data: staff };
  }
);

module.exports = new Staffs();
