import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import timeSince from '../../utils/timeSince';
import prettyBytes from '../../utils/prettyBytes';
import prettyDate from '../../utils/prettyDate';

import { ButtonLink, PostFile, Player } from '../common';

import ReactTooltip from 'react-tooltip';
import QuotePost from './QuotePost';

import { getFileBlob } from '../../actions/files';

const striptags = require('striptags');

const OpPost = ({
  thread,
  board,
  post,
  isThread,
  hiddenPosts,
  auth: { logged },
  hideButton,
  onClick,
  isHidden,
  getFileBlob,
  files,
  rules: { rules },
}) => {
  const [blobFile, setBlobFile] = useState(null);
  const [fileId, setFileId] = useState('');

  const textArray = post.text;

  const tooltipOverridePosition = ({ left, top }, currentEvent, currentTarget, node) => {
    const { height } = node.getBoundingClientRect();

    let newTop = null;
    if (top + height > window.innerHeight)
      newTop = top - Math.abs(top + height - window.innerHeight) - 10;

    return { left, top: newTop || top };
  };

  const postInfo = (
    <div className='post-info'>
      <span className='thread-title'>{thread.subject}</span> <strong>{post.name || 'Anon'}</strong>{' '}
      {prettyDate(post.created_on).toLocaleString()}{' '}
      <span className='small'>({timeSince(post.created_on)}) </span>
      {!isHidden && (
        <Fragment>
          <a href={`/${board.uri}/t${thread.thread_id}#p${post.post_id}`}>No.</a>{' '}
          <a href={`/${board.uri}/t${thread.thread_id}#qp${post.post_id}`}>{thread.thread_id}</a>{' '}
        </Fragment>
      )}
      {!isThread && !isHidden && <a href={`/${board.uri}/t${thread.thread_id}`}>[reply]</a>}
      {rules.length > 0 && (
        <a
          href={`/${board.uri}/t${thread.thread_id}#rp${post.post_id}`}
          onClick={() => onClick('rp', post.post_id)}>
          {' '}
          [!!!]
        </a>
      )}
      {logged && post.user && (
        <span className='small muted'>
          {'  '}
          <i>
            {post.user.ipaddress}::{post.user.fingerprint}
          </i>
        </span>
      )}
    </div>
  );

  const hiddenContent = <span className='small muted'>{postInfo}</span>;

  const text = textArray.map((elem, index) => {
    if (/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/g.test(elem)) {
      let props = {
        style: { display: 'inline-grid' },
        dangerouslySetInnerHTML: { __html: elem },
      };

      let quotePost = null;

      if (/<\s*a[^>]*>(.*?)<\s*\/\s*a>/g.test(elem) && /(>{2}(\d+))/g.test(elem)) {
        const quotePostId = striptags(elem.replace('>>', '')) + '_' + post.post_id;
        const quoted = post.quoted.filter((q) => q.post_id.toString() === quotePostId.split('_')[0])[0];

        return (
          <Fragment key={index}>
            <div {...props} data-tip data-for={quotePostId} />
            <ReactTooltip
              className='tooltip'
              id={quotePostId}
              place='right'
              type='dark'
              effect='solid'
              overridePosition={tooltipOverridePosition}>
              <QuotePost post={quoted} />
            </ReactTooltip>
          </Fragment>
        );
      }

      return (
        <Fragment key={index}>
          <div {...props} />
          {quotePost}
        </Fragment>
      );
    }

    return elem;
  });

  useEffect(() => {
    const { loading, blob, file } = files;

    if (!loading && blob && file && file.file_id === fileId) setBlobFile({ blob, file });
  }, [files, setBlobFile, fileId]);

  useEffect(() => {
    if (blobFile) {
      const { file, blob } = blobFile;

      if (file && blob) {
        const postFile = new Blob([new Uint8Array(blob.data)], { type: file.mimetype });
        const postFileUrl = URL.createObjectURL(postFile);

        const link = document.createElement('a');
        link.href = postFileUrl;
        link.download = file.name + '.' + file.extension;

        document.body.appendChild(link);

        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setFileId('');
        setBlobFile(null);

        document.body.removeChild(link);
      }
    }
  }, [blobFile]);

  const downloadFile = (postFileId) => {
    getFileBlob(postFileId);
    setFileId(postFileId);
  };

  const opPost = (
    <Fragment>
      <div className='post-file'>
        <p className='file-info'>
          <span className='small'>
            {' '}
            {post.file && (
              <Fragment>
                <ButtonLink
                  text={`File: ${post.file.name}.${post.file.extension} (${prettyBytes(
                    post.file.size
                  )})`}
                  onClick={() => downloadFile(post.file.file_id)}
                />
              </Fragment>
            )}
          </span>
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
        <div className='op-post-text'>{text}</div>
      </div>

      {hiddenPosts && <span className='small'>{hiddenPosts} respuestas ocultas</span>}
    </Fragment>
  );

  return (
    <div className='op' id={'p' + post.post_id}>
      <hr className='separator' />

      {hideButton && (
        <ButtonLink text={`[${isHidden ? '+' : '-'}]`} extraClass='hide' onClick={onClick} />
      )}

      {!isHidden ? opPost : hiddenContent}
    </div>
  );
};

OpPost.propTypes = {
  thread: PropTypes.object.isRequired,
  board: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  isThread: PropTypes.bool,
  hiddenPosts: PropTypes.number,
  auth: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  isHidden: PropTypes.bool,
  getFileBlob: PropTypes.func.isRequired,
  files: PropTypes.object,
  hideButton: PropTypes.bool,
  rules: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  files: state.files,
  rules: state.rules,
});

export default connect(mapStateToProps, { getFileBlob })(OpPost);
