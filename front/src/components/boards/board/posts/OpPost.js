import React from 'react';

import prettyBytes from '../../../../utils/prettyBytes';
import timeSince from '../../../../utils/timeSince';
import prettyDate from '../../../../utils/prettyDate';

import { ButtonLink, Image } from '../../../common';

export default ({ thread, post, isThread }) => {
  return (
    <div className='op' id={'p' + post.post_id}>
      <hr className='separator' />

      <ButtonLink text='[-]' altText='[+]' extraClass='hide-thread' />

      <div className='post-file'>
        <p className='file-info'>
          <span className='small'>
            {' '}
            File: {post.file.name + '.' + post.file.contentType.split('/')[1]} (
            {prettyBytes(post.file.size)})
          </span>
        </p>
        <Image className='post-image op' src={post.file.uri.replace('data/image', '/src')} />
      </div>

      <div className='post-body op'>
        <div className='post-info'>
          <span className='thread-title'>{thread.subject}</span> <strong>{post.name || 'Anon'}</strong>{' '}
          {prettyDate(post.created_on).toLocaleString()}{' '}
          <span className='small'>({timeSince(post.created_on)}) </span>
          <a href={`t${thread.thread_id}#p${post.post_id}`}>No.</a>{' '}
          <a href={`t${thread.thread_id}#qp${post.post_id}`}>{thread.thread_id}</a>{' '}
          {!isThread && <a href={`t${thread.thread_id}`}>[reply]</a>}
        </div>
        <div className='op-post-text'>{post.text}</div>
      </div>
    </div>
  );
};
