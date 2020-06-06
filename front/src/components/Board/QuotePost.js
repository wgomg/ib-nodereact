import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Image } from '../common';

import timeSince from '../../utils/timeSince';
import prettyBytes from '../../utils/prettyBytes';
import prettyDate from '../../utils/prettyDate';

const QuotePost = ({ post }) => {
  const textArray = post.text;
  const text = textArray.map((elem, index) => {
    if (/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/g.test(elem)) {
      let props = {
        style: { display: 'inline-grid' },
        dangerouslySetInnerHTML: { __html: elem },
      };

      return <div {...props} key={index} />;
    }

    return elem;
  });

  const postComponent = (
    <div className='container quote-container' key={post.post_id}>
      <div className='post card card-post'>
        <div className='post-info'>
          <strong>{post.name || 'Anon'}</strong> {prettyDate(post.created_on).toLocaleString()}{' '}
          <span className='small'>({timeSince(post.created_on)}) </span>{' '}
          <a href={`t${post.thread_id}#p${post.post_id}`}>No.</a>{' '}
          <a href={`t${post.thread_id}#qp${post.post_id}`}>{post.post_id}</a>
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

        <div className='post-text'>{text}</div>
      </div>
    </div>
  );

  return postComponent;
};

QuotePost.propTypes = {
  post: PropTypes.object.isRequired,
};

export default QuotePost;
