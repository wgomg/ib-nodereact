'use strict';

const cache = require('../libraries/cache');
const BaseController = require('./BaseController');

function Threads() {
  BaseController.call(this);
}

Threads.prototype = Object.create(BaseController.prototype);
Threads.prototype.constructor = Threads;

Threads.prototype.save = BaseController.prototype.routeFunction(
  { http: 'POST', auth: { required: false } },
  async function (body) {
    const { user, files } = body;
    delete body.user;
    delete body.files;

    const Bans = new (require('../models/Bans'))();
    if (Bans.isUserBanned(user))
      return { data: { errors: { user: 'User is banned' } } };

    if (!files || files?.length === 0)
      return { data: { errors: { file: 'A file is required' } } };

    const Files = new (require('../models/Files'))();
    const fileBody = await Files.preprocess(files[0]);
    let errors = Files.validate(fileBody);
    if (errors) return { errors };
    const file = await Files.save(fileBody);
    if (file?.errors) return { data: file };

    const threadBody = {
      board_id: body.board_id,
      subject: body.subject
    };
    const Threads = this.model;
    errors = Threads.validate(threadBody);
    if (errors) return { errors };
    let thread = await Threads.save(threadBody);
    if (thread?.errors) return { data: thread.errors };

    thread = thread[0];
    delete thread.board_id;

    const postBody = {
      thread_id: thread.thread_id,
      ...body.post,
      file_id: file[0].file_id
    };
    const Posts = new (require('../models/Posts'))();
    errors = Posts.validate(postBody);
    if (errors) return { errors };
    const post = await Posts.save(postBody);
    if (post?.errors) return { data: post.errors };

    cache.setPostUser(post[0].post_id, user);

    return { data: { thread } };
  }
);

Threads.prototype.newPosts = BaseController.prototype.routeFunction(
  { http: 'POST', auth: { required: false } },
  async function (thread_id, postBody) {
    const { user, files } = postBody;
    delete postBody.user;
    delete postBody.files;

    const Bans = new (require('../models/Bans'))();
    if (Bans.isUserBanned(user))
      return { data: { errors: { user: 'User is banned' } } };

    let errors = null;

    if (files?.length > 0) {
      const Files = new (require('../models/Files'))();
      const fileBody = await Files.preprocess(files[0]);
      errors = Files.validate(fileBody);
      if (errors) return { errors };
      const file = await Files.save(fileBody);
      if (file?.errors) return { data: file };

      postBody = {
        ...postBody,
        file_id: Files.getEntryId(file[0])
      };
    }

    postBody = { thread_id, ...postBody };

    const Posts = new (require('../models/Posts'))();
    errors = Posts.validate(postBody);
    if (errors) return { errors };
    const post = await Posts.save(postBody);
    if (post?.errors) return { data: post.errors };

    cache.setPostUser(post[0].post_id, user);

    return { data: { ...post[0], user: cache.getPostUser(post[0].post_id) } };
  }
);

Threads.prototype.getPosts = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false }
  },
  async function (thread_id) {
    const Threads = this.model;

    let posts = await Threads.getPosts(thread_id);

    return { data: { thread_id, posts } };
  }
);

module.exports = new Threads();
