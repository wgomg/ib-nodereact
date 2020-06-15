import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ButtonLink, PostFile, Player } from '../common';

import timeSince from '../../utils/timeSince';
import prettyBytes from '../../utils/prettyBytes';
import prettyDate from '../../utils/prettyDate';

import ReactTooltip from 'react-tooltip';
import QuotePost from './QuotePost';

import { getFileBlob } from '../../actions/files';

const striptags = require('striptags');

const Post = ({
  thread,
  board,
  post,
  onClick,
  auth: { logged },
  getFileBlob,
  files,
  rules: { rules },
}) => {
  const [hidden, setHidden] = useState(localStorage.getItem('hidden').split(','));
  const [isHidden, setIsHidden] = useState(hidden.includes('p' + post.post_id));

  useEffect(() => {
    localStorage.setItem('hidden', hidden);
  }, [hidden, post]);

  const [blobFile, setBlobFile] = useState(null);
  const [fileId, setFileId] = useState('');

  const onHiddenClick = (id) => {
    const postIsHidden = hidden.includes('p' + id);

    if (postIsHidden) setHidden(hidden.filter((hide) => hide !== 'p' + id));
    else setHidden([...hidden, 'p' + id]);

    setIsHidden(!postIsHidden);
  };

  const tooltipOverridePosition = ({ left, top }, currentEvent, currentTarget, node) => {
    const { height } = node.getBoundingClientRect();

    let newTop = null;
    if (top + height > window.innerHeight)
      newTop = top - Math.abs(top + height - window.innerHeight) - 10;

    return { left, top: newTop || top };
  };

  const postInfo = (
    <div className='post-info'>
      <strong>{post.name || 'Anon'}</strong> {prettyDate(post.created_on).toLocaleString()}{' '}
      <span className='small'>({timeSince(post.created_on)}) </span>{' '}
      <a href={`/${board.uri}/t${thread.thread_id}#p${post.post_id}`}>No.</a>{' '}
      <a
        href={`/${board.uri}/t${thread.thread_id}#qp${post.post_id}`}
        onClick={() => onClick('qp', post.post_id)}>
        {post.post_id}
      </a>{' '}
      {rules.length > 0 && (
        <a
          href={`/${board.uri}/t${thread.thread_id}#rp${post.post_id}`}
          onClick={() => onClick('rp', post.post_id)}>
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

  const text = post.text.map((elem, index) => {
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

  const postContent = (
    <Fragment>
      {postInfo}
      <p className='file-info-post'>
        <span className='small'>
          {' '}
          {post.file && (
            <Fragment>
              <ButtonLink
                text={`File: ${post.file.name}.${post.file.extension} (${prettyBytes(post.file.size)})`}
                onClick={() => downloadFile(post.file.file_id)}
              />
            </Fragment>
          )}
        </span>
      </p>

      <div className='post-file'>
        <PostFile post={post} />
      </div>

      <div className='post-text'>{text}</div>

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
          text={`[${isHidden ? '+' : '-'}]`}
          extraClass='hide'
          onClick={() => onHiddenClick(post.post_id)}
        />

        {!isHidden ? postContent : hiddenContent}
      </div>
    </div>
  );
};

Post.propTypes = {
  thread: PropTypes.object.isRequired,
  board: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  auth: PropTypes.object.isRequired,
  getFileBlob: PropTypes.func.isRequired,
  files: PropTypes.object,
  rules: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  files: state.files,
  rules: state.rules,
});

export default connect(mapStateToProps, { getFileBlob })(Post);
