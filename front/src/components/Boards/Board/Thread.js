import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Post from './Post';
import OpPost from './OpPost';

export default ({ thread, board }) => {
  let posts = [...thread.posts];

  const opPost = <OpPost thread={thread} post={posts[0]} isThread={true} />;

  const postsList = posts
    .splice(1)
    .map((post) => <Post thread={thread} post={post} key={post.post_id} />);

  return (
    <Fragment>
      {opPost}
      {postsList}

      <hr className='separator' />
      <div className='container centered'>[ {<Link to={`/${board.uri}/`}>return</Link>} ]</div>
    </Fragment>
  );
};
