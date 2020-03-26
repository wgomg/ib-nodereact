import React from 'react';

import { ButtonLink, Image } from '../../../common';

import timeSince from '../../../../utils/timeSince';
import prettyBytes from '../../../../utils/prettyBytes';
import prettyDate from '../../../../utils/prettyDate';

export default ({ thread, post }) => {
  return (
    <div className='container post-container' id={'p' + post.post_id} key={post.post_id}>
      <div className='post card card-post'>
        <ButtonLink text='[-]' altText='[+]' extraClass='hide-thread' />

        <div className='post-body columns'>
          <div className='post-info col-10'>
            <span className='thread-title'>{thread.subject}</span> <strong>{post.name || 'Anon'}</strong>{' '}
            {prettyDate(post.created_on).toLocaleString()}{' '}
            <span className='small'>({timeSince(post.created_on)}) </span>{' '}
            <a href={`t${thread.thread_id}#p${post.post_id}`}>No.</a>{' '}
            <a href={`t${thread.thread_id}#qp${post.post_id}`}>{post.post_id}</a>{' '}
          </div>
          <div className='columns'>
            {post.file && (
              <div className='post-file in-body'>
                <p className='file-info'>
                  <span className='small'>
                    {' '}
                    File: {post.file.name + '.' + post.file.contentType.split('/')[1]} (
                    {prettyBytes(post.file.size)})
                  </span>
                </p>
                <Image className='post-image' src={post.file.uri.replace('data/image', '/src')} />
              </div>
            )}
            <div className='post-text'>{post.text}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
