'use strict';

const BaseController = require('./BaseController');

function Settings() {
  BaseController.call(this);
}

Settings.prototype = Object.create(BaseController.prototype);
Settings.prototype.constructor = Settings;

Settings.prototype.save = BaseController.prototype.routeFunction(
  {
    http: 'POST',
    auth: { required: true, access: 'admin' }
  },
  async function (body) {
    return await BaseController.prototype.save.call(this, body);
  }
);

Settings.prototype.update = BaseController.prototype.routeFunction(
  {
    http: 'PUT',
    auth: { required: true, access: 'admin' }
  },
  async function (body) {
    return await BaseController.prototype.update.call(this, body);
  }
);

Settings.prototype.getAll = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false, access: 'admin' }
  },
  async function () {
    return await this.get();
  }
);

Settings.prototype.delete = BaseController.prototype.routeFunction(
  {
    http: 'DELETE',
    auth: { required: true, access: 'admin' }
  },
  async function (body) {
    return await BaseController.prototype.delete.call(this, body);
  }
);

module.exports = new Settings();
