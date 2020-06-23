import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Post from './Post';
import OpPost from './OpPost';

const ThreadPreview = ({ thread, index, topThread, localStorage: { hiddenThreads } }) => {
  const [threadHideState, setThreadHideState] = useState(false);

  useEffect(() => {
    setThreadHideState(hiddenThreads.includes(thread.thread_id));
  }, [hiddenThreads, thread]);

  let postsList =
    thread.posts.length > 1 && !threadHideState
      ? thread.posts
          .slice(Math.max(thread.posts.length - 5, 1))
          .map((post) => <Post thread={thread} post={post} key={post.post_id} />)
      : '';

  const opPost = <OpPost thread={thread} post={thread.posts[0]} />;

  let divProps = {
    className: 'container thread-preview',
    id: 't' + thread.thread_id,
    key: thread.thread_id,
  };

  if (index === 0) divProps.ref = topThread;

  return (
    <div {...divProps}>
      {opPost}
      {postsList}
    </div>
  );
};

ThreadPreview.propTypes = {
  thread: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  topThread: PropTypes.object.isRequired,
  localStorage: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  localStorage: state.localStorage,
});

export default connect(mapStateToProps)(ThreadPreview);
