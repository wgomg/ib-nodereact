import React, { Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';

import Post from './Post';
import OpPost from './OpPost';

export default ({ thread, board }) => {
  let posts = [...thread.posts];

  const hash = window.location.hash;
  const currRef = useRef(null);

  const opPost = <OpPost thread={thread} post={posts[0]} isThread={true} />;

  const postsList = posts.splice(1).map((post, index) => {
    let props = { id: 'p' + post.post_id, key: index };

    if (hash && hash.includes(post.post_id)) {
      if (currRef.current) currRef.current.firstChild.firstChild.classList.remove('hashed');

      props.ref = currRef;
    }

    return (
      <div {...props}>
        <Post thread={thread} post={post} />
      </div>
    );
  });

  setTimeout(() => {
    if (hash && currRef.current) {
      window.scrollTo({ left: 0, top: currRef.current.offsetTop, behavior: 'smooth' });
      currRef.current.firstChild.firstChild.classList.add('hashed');
    }
  }, 100);

  return (
    <Fragment>
      {opPost}
      {postsList}

      <hr className='separator' />
      <div className='container centered'>[ {<Link to={`/${board.uri}/`}>return</Link>} ]</div>
    </Fragment>
  );
};
