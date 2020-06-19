import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ButtonLink, PostFile, Player } from '../common';
import FileDownload from './FileDownload';
import PostHeader from './PostHeader';
import PostText from './PostText';

import { hidePost, unhidePost } from '../../actions/localStorage';

const Post = ({ thread, post, localStorage: { hiddenPosts }, hidePost, unhidePost }) => {
  const [postHideState, setPostHideState] = useState(false);

  useEffect(() => {
    setPostHideState(hiddenPosts.includes(post.post_id));
  }, [hiddenPosts, post]);

  const hideOrUnhidePost = (post_id) => {
    if (postHideState) unhidePost(post_id);
    else hidePost(post_id);
  };

  const postInfo = (
    <PostHeader thread={thread} post={post} isHidden={postHideState} onClick={() => null} />
  );

  const hiddenContent = <span className='small muted'>{postInfo}</span>;

  const postContent = (
    <Fragment>
      {postInfo}

      <p className='file-info-post'>
        <FileDownload post={post} />
      </p>

      <div className='post-file'>
        <PostFile post={post} />
      </div>

      <div className='post-text'>
        <PostText post={post} />
      </div>

      {post.file_url && (
        <div style={{ display: 'inline-block' }}>
          <Player post={post} />
        </div>
      )}
    </Fragment>
  );

  return (
    <div className='container post-container' key={post.post_id}>
      <div className='post card card-post'>
        <ButtonLink
          text={`[${postHideState ? '+' : '-'}]`}
          extraClass='hide'
          onClick={() => hideOrUnhidePost(post.post_id)}
        />

        {!postHideState ? postContent : hiddenContent}
      </div>
    </div>
  );
};

Post.propTypes = {
  thread: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  localStorage: PropTypes.object.isRequired,
  hidePost: PropTypes.func.isRequired,
  unhidePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  rules: state.rules,
  localStorage: state.localStorage,
});

export default connect(mapStateToProps, { hidePost, unhidePost })(Post);
