import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import timeSince from '../../utils/timeSince';
import prettyBytes from '../../utils/prettyBytes';
import prettyDate from '../../utils/prettyDate';

import { ButtonLink, Image } from '../common';

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
  files: { file, blob, loading },
}) => {
  const [hide, setHide] = useState(true);
  const [getFile, setGetFile] = useState(false);

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
      {logged && (
        <span className='small muted'>
          {'  '}
          <i>{post.user}</i>
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
              overridePosition={tooltipOverridePosition}
            >
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
    if (getFile) getFileBlob(getFile);
  }, [getFile, getFileBlob]);

  useEffect(() => {
    if (!loading && file && blob) {
      const pdf = new Blob([new Uint8Array(blob.data)], { type: file.mimetype });

      const pdfUrl = URL.createObjectURL(pdf);

      window.open(pdfUrl);

      setGetFile(false);
    }
  }, [file, blob, loading]);

  const openTab = async (fileName) => {
    setGetFile(fileName);
  };

  const opPost = (
    <Fragment>
      <div className='post-file'>
        <p className='file-info'>
          <span className='small'>
            {' '}
            {post.file && (
              <Fragment>
                File: {post.file.name + '.' + post.file.extension} ({prettyBytes(post.file.size)})
              </Fragment>
            )}
          </span>
        </p>
        {post.file && (
          <Fragment>
            <Image
              className='post-image'
              src={'/' + post.file.thumb}
              hide={!hide}
              onClick={
                post.file.extension !== 'pdf' ? () => setHide(!hide) : () => openTab(post.file.name)
              }
            />

            {post.file.extension !== 'pdf' && (
              <Image
                className='post-image'
                src={'/' + post.file.folder + '/' + post.file.name + '.' + post.file.extension}
                hide={hide}
                onClick={() => setHide(!hide)}
              />
            )}
          </Fragment>
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
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  files: state.files,
});

export default connect(mapStateToProps, { getFileBlob })(OpPost);
