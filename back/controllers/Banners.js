'use strict';

const BaseController = require('./BaseController');

function Banners() {
  BaseController.call(this);
}

Banners.prototype = Object.create(BaseController.prototype);
Banners.prototype.constructor = Banners;

Banners.prototype.save = BaseController.prototype.routeFunction(
  {
    http: 'POST',
    auth: { required: true, access: 'staff' }
  },
  async function (body) {
    const { files } = body;
    delete body.files;

    if (!files || files?.length === 0)
      return { data: { errors: { file: 'A file is required' } } };

    const Files = new (require('../models/Files'))();
    const file = await Files.save(files[0]);

    if (file?.errors) return { data: file.errors };

    const reportBody = {
      board_id: body.board_id,
      file_id: file[0].file_id
    };

    const Banners = this.model;

    let banner = await Banners.save(reportBody);

    return { data: { banner } };
  }
);

Banners.prototype.getAll = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false }
  },
  async function () {
    return await this.get();
  }
);

module.exports = new Banners();
