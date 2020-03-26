import React, { Fragment } from 'react';

import Post from './posts/Post';
import OpPost from './posts/OpPost';

export default ({ thread, boardUri }) => {
  let posts = [...thread.posts];

  const opPost = (
    <div className='container'>
      <OpPost thread={thread} post={posts[0]} boardUri={boardUri} />
    </div>
  );

  const postsList = posts.splice(1).map(post => (
    <div className='container post-container' key={post.post_id}>
      <Post thread={thread} post={post} boardUri={boardUri} />
    </div>
  ));

  return (
    <Fragment>
      {opPost}
      {postsList}
    </Fragment>
  );
};
