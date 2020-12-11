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
    const fileBody = await Files.preprocess(files[0]);
    let errors = Files.validate(fileBody);
    if (errors) return { errors };
    const file = await Files.save(fileBody);
    if (file?.errors) return { data: file };

    const reportBody = {
      board_id: body.board_id,
      file_id: file[0].file_id
    };

    const Banners = this.model;
    errors = Banners.validate(reportBody);
    if (errors) return { errors };

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
