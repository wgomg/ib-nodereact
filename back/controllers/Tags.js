'use strict';

const BaseController = require('./BaseController');

function Tags() {
  BaseController.call(this);
}

Tags.prototype = Object.create(BaseController.prototype);
Tags.prototype.constructor = Tags;

Tags.prototype.getAll = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false }
  },
  async function () {
    return await this.get();
  }
);

module.exports = new Tags();
