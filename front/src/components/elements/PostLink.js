import React from 'react';
import { Link } from 'react-router-dom';

export default ({ board, post, fullLink }) => {
  let postLink = `/${board.uri}`;

  const thread_id = post ? post.Threads.thread_id : null;
  if (thread_id) postLink += `/${thread_id}`;

  const post_id = post ? post.post_id : null;
  if (post_id) postLink += `/${post_id}`;

  const arrows = postLink.split('/').length === 2 ? '>>>' : '>>';

  const textLink = fullLink
    ? postLink
    : postLink
        .split('/')
        .slice(-1)
        .join('/');

  return (
    <Link to={postLink}>
      {arrows}
      {textLink}
    </Link>
  );
};
