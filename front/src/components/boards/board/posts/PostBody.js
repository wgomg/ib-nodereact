import React from 'react';

import timeSince from '../../../../utils/timeSince';

export default ({ thread, post }) => {
  return (
    <div className='post post'>
      <p className='post-info'>
        <span className='thread-title'>{thread.subject}</span> <strong>{post.name || 'Anon'}</strong>{' '}
        {timeSince(post.created_on)} <a href={`t${thread.thread_id}#p${post.post_id}`}>No.</a>
        <a href={`t${thread.thread_id}#qp${post.post_id}`}>{thread.thread_id}</a>{' '}
        <a href={`t${thread.thread_id}`}>[reply]</a>
      </p>
      <div className='post-text'>{post.text}</div>
    </div>
  );
};
