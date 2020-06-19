import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import prettyDate from '../../utils/prettyDate';
import timeSince from '../../utils/timeSince';

const PostHeader = ({ thread, post, isHidden, op, onClick, isThread, rules, auth: { logged } }) => {
  const threadSubject = op ? <span className='thread-title'>{thread.subject + ' '}</span> : '';

  const postName = (
    <Fragment>
      <strong>{post.name || 'Anon'}</strong> {prettyDate(post.created_on).toLocaleString() + ' '}
    </Fragment>
  );

  const postCreationDate = <span className='small'>{timeSince(post.created_on)} </span>;

  const postInfo = !isHidden ? (
    <Fragment>
      <Link to={`/${post.board[0].uri}/t${thread.thread_id}#p${post.post_id}`}>No. </Link>
      <Link
        to={`/${post.board[0].uri}/t${thread.thread_id}#qp${post.post_id}`}
        onClick={() => onClick('qp', post.post_id)}>
        {op ? thread.thread_id : post.post_id}{' '}
      </Link>
      {!isThread && op && <Link to={`/${post.board[0].uri}/t${thread.thread_id}`}>[reply]</Link>}
    </Fragment>
  ) : (
    ''
  );

  const reportButton =
    rules.length > 0 && post.user ? (
      <Link
        to={`/${post.board[0].uri}/t${thread.thread_id}#rp${post.post_id}`}
        onClick={() => onClick('rp', post.post_id)}>
        {' '}
        [!!!]
      </Link>
    ) : (
      ''
    );

  const postUser =
    logged && post.user ? (
      <span className='small muted'>
        {'  '}
        <i>
          {post.user.ipaddress}::{post.user.fingerprint}
        </i>
      </span>
    ) : (
      ''
    );

  return (
    <div className='post-info'>
      {threadSubject}
      {postName}
      {postCreationDate}
      {postInfo}
      {reportButton}
      {postUser}
    </div>
  );
};

PostHeader.propTypes = {
  thread: PropTypes.object,
  post: PropTypes.object.isRequired,
  isHidden: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  isThread: PropTypes.bool,
  rules: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  op: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  rules: state.rules,
  auth: state.auth,
});

export default connect(mapStateToProps)(PostHeader);
