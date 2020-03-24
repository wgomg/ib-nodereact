import React from 'react';

import PostBody from './PostBody';
import PostFile from './PostFile';

import { ButtonLink } from '../../../common';

export default ({ thread, post, className }) => {
  return (
    <div className={className}>
      <hr className='separator' />

      <ButtonLink text='[-]' altText='[+]' extraClass='hide-thread' />

      <div className='post-file'>{post.file && <PostFile file={post.file} />}</div>

      <PostBody thread={thread} post={post} />
    </div>
  );
};
