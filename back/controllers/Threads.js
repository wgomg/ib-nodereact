'use strict';

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

    if (!files || (files && files.length === 0))
      return { data: { errors: { file: 'A file is required' } } };

    const Files = new (require('../models/Files'))();
    const file = await Files.save(files[0]);

    if (file && file[0].errors) return { data: file[0] };

    const threadBody = {
      board_id: body.board_id,
      subject: body.subject,
    };

    const Threads = this.model;

    let thread = await Threads.save(threadBody);

    if (thread && thread[0].errors) return { data: thread[0] };

    thread = thread[0];
    delete thread.board_id;

    const postBody = {
      thread_id: thread.thread_id,
      ...body.post,
      file_id: file[0].file_id,
    };

    const Posts = new (require('../models/Posts'))();

    const post = await Posts.save(postBody);

    if (post && post[0].errors) return { data: post[0] };

    return { data: thread };
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

    if (files && files.length > 0) {
      const Files = new (require('../models/Files'))();
      const file = await Files.save(files[0]);

      if (file && file.errors) return { data: file };

      postBody = {
        ...postBody,
        file_id: Files.getEntryId(file[0]),
        thread_id,
      };
    }

    const Posts = new (require('../models/Posts'))();

    const post = await Posts.save({ thread_id, ...postBody });

    return { data: post ? post[0] : null };
  }
);

Threads.prototype.getPosts = BaseController.prototype.routeFunction(
  {
    http: 'GET',
    auth: { required: false },
  },
  async function (thread_id) {
    const Threads = this.model;

    let posts = await Threads.getPosts(thread_id);

    return { data: { thread_id, posts } };
  }
);

module.exports = new Threads();
