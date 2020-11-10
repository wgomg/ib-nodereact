'use strict';

const BaseController = require('./BaseController');

function Reports() {
  BaseController.call(this);
}

Reports.prototype = Object.create(BaseController.prototype);
Reports.prototype.constructor = Reports;

Reports.prototype.getAll = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: true, access: 'staff' },
  },
  async function () {
    const Reports = this.model;
    let reports = await Reports.get();

    const Posts = require('../models/Posts');
    const Boards = require('../models/Boards');
    const Rules = require('../models/Rules');

    reports = await Promise.all(
      reports.map(async (rep) => {
        const Post = new Posts();
        rep.post = await Post.get([{ field: 'post_id', value: rep.post_id }]);
        delete rep.post_id;

        const Board = new Boards();
        rep.board = await Board.get([
          { field: 'board_id', value: rep.board_id },
        ]);
        delete rep.board_id;

        const Rule = new Rules();
        rep.rule = await Rule.get([{ field: 'rule_id', value: rep.rule_id }]);
        delete rep.rule_id;

        return rep;
      })
    );

    return { data: { reports } };
  }
);

Reports.prototype.setSolved = BaseController.prototype.routeFunction(
  { http: 'PUT', auth: { required: true, access: 'staff' } },
  async function (report_id) {
    return await this.update({ report_id, solved: '1' });
  }
);

module.exports = new Reports();
