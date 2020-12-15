'use strict';

const BaseController = require('./BaseController');

function Themes() {
  BaseController.call(this);
}

Themes.prototype = Object.create(BaseController.prototype);
Themes.prototype.constructor = Themes;

Themes.prototype.getAll = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false }
  },
  async function () {
    return await BaseController.prototype.get.call(this);
  }
);

Themes.prototype.get = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false }
  },
  async function (theme_id) {
    const theme = await BaseController.prototype.get.call(this, [
      { field: 'theme_id', value: theme_id }
    ]);

    console.log(theme);

    return { data: theme?.data[0] ?? [] };
  }
);

module.exports = new Themes();
