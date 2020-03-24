import React from 'react';

import PostBody from './PostBody';
import PostFile from './PostFile';

export default ({ thread, post, className }) => {
  return (
    <div className={className}>
      <hr className='separator' />
      <a className='hide-thread' href='/'>
        [-]
      </a>

      <div className='post-file'>{post.file && <PostFile file={post.file} />}</div>

      <PostBody thread={thread} post={post} />
    </div>
  );
};
