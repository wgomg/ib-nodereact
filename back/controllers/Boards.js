'use strict';

const BaseController = require('./BaseController');

function Boards() {
  BaseController.call(this);
}

Boards.prototype = Object.create(BaseController.prototype);
Boards.prototype.constructor = Boards;

Boards.prototype.getAll = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false },
  },
  async function () {
    return await this.get();
  }
);

Boards.prototype.getThreads = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false },
  },
  async function (board_id) {
    const Boards = this.model;

    let threads = await Boards.getThreads(board_id);

    return { data: { board_id, threads } };
  }
);

Boards.prototype.getReports = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: true, access: 'staff' },
  },
  async function (board_id) {
    const Boards = this.model;

    let reports = await Boards.getReports(board_id);

    const Posts = require('../models/Posts');
    const Rules = require('../models/Rules');

    reports = await Promise.all(
      reports.map(async (rep) => {
        const Post = new Posts();
        rep.post = await Post.get([{ field: 'post_id', value: rep.post_id }]);
        delete rep.post_id;

        const Rule = new Rules();
        rep.rule = await Rule.get([{ field: 'rule_id', value: rep.rule_id }]);
        delete rep.rule_id;

        return rep;
      })
    );

    return { data: { board_id, reports } };
  }
);

Boards.prototype.getRules = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false },
  },
  async function (board_id) {
    const Boards = this.model;

    const rules = await Boards.getRules(board_id);

    return { data: { board_id, rules } };
  }
);

Boards.prototype.getBanners = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false },
  },
  async function (board_id) {
    const Boards = this.model;

    let banners = await Boards.getBanners(board_id);

    return { data: { board_id, banners } };
  }
);

module.exports = new Boards();
