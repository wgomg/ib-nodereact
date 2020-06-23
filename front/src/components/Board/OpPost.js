import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useLocation } from 'react-router-dom';

import { ButtonLink, PostFile, Player } from '../common';
import FileDownload from './FileDownload';
import PostHeader from './PostHeader';
import PostText from './PostText';

import { hideThread, unhideThread } from '../../actions/localStorage';

const OpPost = ({
  thread,
  post,
  isThread,
  hideThread,
  unhideThread,
  localStorage: { hiddenThreads },
  onOpenTooltipClick,
}) => {
  const location = useLocation();
  const [isReferenced, setIsReferenced] = useState(false);

  useEffect(() => {
    if (isThread && location.hash && location.hash.includes('p' + post.post_id)) setIsReferenced(true);
    else setIsReferenced(false);
  }, [location, post, isThread]);

  const [threadHideState, setThreadHideState] = useState(false);

  useEffect(() => {
    setThreadHideState(hiddenThreads.includes(thread.thread_id));
  }, [hiddenThreads, thread]);

  const hideOrUnhideThread = (thread_id) => {
    if (threadHideState) unhideThread(thread_id);
    else hideThread(thread_id);
  };

  const postInfo = (
    <PostHeader
      thread={thread}
      post={post}
      isHidden={threadHideState}
      onOpenTooltipClick={onOpenTooltipClick}
      isThread={isThread}
      isReferenced={isReferenced}
      op={true}
    />
  );

  const opPostHidden = <span className='small muted'>{postInfo}</span>;

  const opPost = (
    <Fragment>
      <div className='post-file'>
        <p className='file-info'>
          <FileDownload post={post} />
        </p>

        <PostFile post={post} />

        {post.file_url && (
          <div style={{ display: 'inline-block' }}>
            <Player post={post} />
          </div>
        )}
      </div>

      <div className='post-body op'>
        {postInfo}

        <div className='op-post-text'>
          <PostText post={post} />
        </div>
      </div>

      {thread.hiddenPosts && <span className='small'>{thread.hiddenPosts} respuestas ocultas</span>}
    </Fragment>
  );

  return (
    <div className='op' id={'p' + post.post_id}>
      <hr className='separator' />

      {!isThread && (
        <ButtonLink
          text={`[${threadHideState ? '+' : '-'}]`}
          extraClass='hide'
          onClick={() => hideOrUnhideThread(thread.thread_id)}
        />
      )}

      {threadHideState && !isThread ? opPostHidden : opPost}
    </div>
  );
};

OpPost.defaultProps = {
  isThread: false,
};

OpPost.propTypes = {
  thread: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  isThread: PropTypes.bool.isRequired,
  hiddenPosts: PropTypes.number,
  hideThread: PropTypes.func.isRequired,
  unhideThread: PropTypes.func.isRequired,
  onOpenTooltipClick: PropTypes.func,
};

const mapStateToProps = (state) => ({
  localStorage: state.localStorage,
});

export default connect(mapStateToProps, { hideThread, unhideThread })(OpPost);
