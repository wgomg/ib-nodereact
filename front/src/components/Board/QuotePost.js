import React from 'react';
import PropTypes from 'prop-types';

import { PostFile } from '../common';
import PostHeader from './PostHeader';
import PostText from './PostText';

const QuotePost = ({ post, thread }) => {
  const postComponent = (
    <div className='container quote-container' key={post.post_id}>
      <div className='post card card-post'>
        <PostHeader thread={thread} post={post} onOpenTooltipClick={() => null} />

        <div className='post-file'>
          <PostFile post={post} />
        </div>

        <div className='post-text'>
          <PostText post={post} thread={thread} />
        </div>
      </div>
    </div>
  );

  return postComponent;
};

QuotePost.propTypes = {
  post: PropTypes.object.isRequired,
  thread: PropTypes.object.isRequired,
};

export default QuotePost;
