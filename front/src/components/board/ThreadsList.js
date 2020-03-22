import React, { Fragment } from 'react';

import { Loading } from '../common';

import prettyBytes from '../../utils/prettyBytes';
import timeSince from '../../utils/timeSince';

export default ({ board }) => (
  <div className='container'>
    {board.threads.map(thread => {
      let threadView = <Loading key={thread.thread_id} />;

      if (thread.posts.length > 0) {
        const op = thread.posts.shift();

        const opImgSrc = op.file ? op.file.uri.replace('data/image', '/src') : null;

        threadView = (
          <div className='container thread-preview' key={thread.thread_id}>
            <hr className='separator' />
            <a className='hide-thread' href='#'>
              [-]
            </a>

            <div className='post-file'>
              {op.file && (
                <Fragment>
                  <p className='file-info'>
                    <span className='small'>
                      {' '}
                      File: {op.file.name + '.' + op.file.contentType.split('/')[1]} (
                      {prettyBytes(op.file.size)})
                    </span>
                  </p>
                  <img className='post-image' src={opImgSrc} alt='post-image' />
                </Fragment>
              )}
            </div>
            <div className='post op'>
              <p className='op-info'>
                <span className='thread-title'>{thread.subject}</span>{' '}
                <strong>{op.name || 'Anon'}</strong> {timeSince(op.created_on)}{' '}
                <a href={`t${thread.thread_id}#p${op.post_id}`}>No.</a>
                <a href={`t${thread.thread_id}#qp${op.post_id}`}>{thread.thread_id}</a>{' '}
                <a href={`t${thread.thread_id}`}>[reply]</a>
              </p>
              <div className='op-text'>{op.text}</div>
            </div>
          </div>
        );
      }

      return threadView;
    })}
  </div>
);
