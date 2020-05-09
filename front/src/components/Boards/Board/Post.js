import React from 'react';

import { ButtonLink, Image } from '../../common';

import timeSince from '../../../utils/timeSince';
import prettyBytes from '../../../utils/prettyBytes';
import prettyDate from '../../../utils/prettyDate';
import { Fragment } from 'react';

export default ({ thread, post }) => {
  return (
    <div className='container post-container' key={post.post_id}>
      <div className='post card card-post'>
        <ButtonLink text='[-]' altText='[+]' extraClass='hide-thread' />

        <div className='post-info'>
          <strong>{post.name || 'Anon'}</strong> {prettyDate(post.created_on).toLocaleString()}{' '}
          <span className='small'>({timeSince(post.created_on)}) </span>{' '}
          <a href={`t${thread.thread_id}#p${post.post_id}`}>No.</a>{' '}
          <a href={`t${thread.thread_id}#qp${post.post_id}`}>{post.post_id}</a>
        </div>

        <p className='file-info-post'>
          <span className='small'>
            {' '}
            {post.file && (
              <Fragment>
                File: {post.file.name + '.' + post.file.extension} ({prettyBytes(post.file.size)})
              </Fragment>
            )}
          </span>
        </p>

        <div className='post-file'>
          {post.file && (
            <Image
              className='post-image op'
              src={'/' + post.file.folder + '/' + post.file.name + '.' + post.file.extension}
            />
          )}
        </div>

        <div className='post-text' dangerouslySetInnerHTML={{ __html: post.text }} />
      </div>
    </div>
  );
};
