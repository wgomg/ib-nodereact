'use strict';

const BaseController = require('./BaseController');

function Posts() {
  BaseController.call(this);
}

Posts.prototype = Object.create(BaseController.prototype);
Posts.prototype.constructor = Posts;

Posts.prototype.getLatests = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false },
  },
  async function () {
    const Posts = this.model;
    let latests = await Posts.getLatests();

    const Threads = require('../models/Threads');
    const Boards = require('../models/Boards');

    latests = await Promise.all(
      latests.map(async (post) => {
        const Thread = new Threads();
        const thread = await Thread.get([
          { field: 'thread_id', value: post.thread_id },
        ]);

        const Board = new Boards();
        const board = await Board.get([
          { field: 'board_id', value: thread[0].board_id },
        ]);

        delete thread[0].board_id;
        delete post.thread_id;

        return { board: board[0], thread: thread[0], post };
      })
    );

    return { data: { latests } };
  }
);

module.exports = new Posts();
