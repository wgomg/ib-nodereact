'use strict';

const BaseController = require('./BaseController');

function Rules() {
  BaseController.call(this);
}

Rules.prototype = Object.create(BaseController.prototype);
Rules.prototype.constructor = Rules;

Rules.prototype.getAll = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false }
  },
  async function () {
    return await this.get();
  }
);

module.exports = new Rules();
