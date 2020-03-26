import React, { Fragment } from 'react';

import Post from './posts/Post';
import OpPost from './posts/OpPost';

export default ({ thread }) => {
  let posts = [...thread.posts];

  const opPost = <OpPost thread={thread} post={posts[0]} isThread={true} />;

  const postsList = posts.splice(1).map(post => <Post thread={thread} post={post} />);

  return (
    <Fragment>
      {opPost}
      {postsList}
    </Fragment>
  );
};
