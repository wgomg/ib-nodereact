import React, { Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';

import Post from './Post';
import OpPost from './OpPost';

export default ({ thread, board }) => {
  let posts = [...thread.posts];

  const hash = window.location.hash;
  const ref = useRef(null);

  const opPost = <OpPost thread={thread} post={posts[0]} isThread={true} />;

  const postsList = posts.splice(1).map((post) => {
    let props = { id: 'p' + post.post_id, key: post.post_id };

    if (hash && hash.includes(post.post_id)) props.ref = ref;

    return (
      <div {...props}>
        <Post thread={thread} post={post} />
      </div>
    );
  });

  if (hash && ref.current) {
    setTimeout(() => {
      window.scrollTo({ left: 0, top: ref.current.offsetTop, behavior: 'smooth' });
    }, 100);
  }

  return (
    <Fragment>
      {opPost}
      {postsList}

      <hr className='separator' />
      <div className='container centered'>[ {<Link to={`/${board.uri}/`}>return</Link>} ]</div>
    </Fragment>
  );
};
