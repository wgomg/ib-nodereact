import React from 'react';
import { Link } from 'react-router-dom';

export default ({ board, post, fullLink }) => {
  let postLink = `/${board.uri}`;

  const thread_id = post ? post.thread_id : null;
  if (thread_id) postLink += `/t${thread_id}`;

  const post_id = post ? post.post_id : null;
  if (post_id) postLink += `#p${post_id}`;

  const arrows = postLink.split('/').length === 2 ? '>>>' : '>>';

  const textLink = fullLink
    ? postLink.replace(/t[\d]+#p/i, '')
    : postLink
        .split('/')
        .slice(-1)
        .join('/')
        .replace(/t[\d]+#p/i, '');

  return (
    <Link to={{ pathname: postLink.split('#')[0], hash: '#' + postLink.split('#')[1] }}>
      {arrows}
      {textLink}
    </Link>
  );
};
