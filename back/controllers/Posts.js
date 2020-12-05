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
    auth: { required: false }
  },
  async function () {
    const Posts = this.model;
    let latests = await Posts.getLatests();

    return { data: { latests } };
  }
);

module.exports = new Posts();
