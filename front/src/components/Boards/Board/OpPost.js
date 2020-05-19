import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import prettyBytes from '../../../utils/prettyBytes';
import timeSince from '../../../utils/timeSince';
import prettyDate from '../../../utils/prettyDate';

import { ButtonLink, Image } from '../../common';
import { Fragment } from 'react';

const OpPost = ({ thread, post, isThread, hiddenPosts, auth: { logged } }) => {
  return (
    <div className='op' id={'p' + post.post_id}>
      <hr className='separator' />

      <ButtonLink text='[-]' altText='[+]' extraClass='hide-thread' />

      <div className='post-file'>
        <p className='file-info'>
          <span className='small'>
            {' '}
            {post.file && (
              <Fragment>
                File: {post.file.name + '.' + post.file.extension} ({prettyBytes(post.file.size)})
              </Fragment>
            )}
          </span>
        </p>
        {post.file && (
          <Image
            className='post-image op'
            src={'/' + post.file.folder + '/' + post.file.name + '.' + post.file.extension}
          />
        )}
      </div>

      <div className='post-body op'>
        <div className='post-info'>
          <span className='thread-title'>{thread.subject}</span> <strong>{post.name || 'Anon'}</strong>{' '}
          {prettyDate(post.created_on).toLocaleString()}{' '}
          <span className='small'>({timeSince(post.created_on)}) </span>
          <a href={`t${thread.thread_id}#p${post.post_id}`}>No.</a>{' '}
          <a href={`t${thread.thread_id}#qp${post.post_id}`}>{thread.thread_id}</a>{' '}
          {!isThread && <a href={`t${thread.thread_id}`}>[reply]</a>}
          {logged && (
            <span className='small muted'>
              {'  '}
              <i>{post.user}</i>
            </span>
          )}
        </div>
        <div className='op-post-text' dangerouslySetInnerHTML={{ __html: post.text }} />
      </div>

      {hiddenPosts && <span className='small'>{hiddenPosts} respuestas ocultas</span>}
    </div>
  );
};

OpPost.propTypes = {
  thread: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  isThread: PropTypes.bool,
  hiddenPosts: PropTypes.number,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(OpPost);
