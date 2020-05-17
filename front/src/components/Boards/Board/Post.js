import React, { Fragment } from 'react';

import { ButtonLink, Image } from '../../common';

import timeSince from '../../../utils/timeSince';
import prettyBytes from '../../../utils/prettyBytes';
import prettyDate from '../../../utils/prettyDate';

import ReactTooltip from 'react-tooltip';
import QuotePost from './QuotePost';

const striptags = require('striptags');

export default ({ thread, board, post, onClick }) => {
  const textArray = post.text;

  const tooltipOverridePosition = ({ left, top }, currentEvent, currentTarget, node) => {
    const { height } = node.getBoundingClientRect();

    let newTop = null;
    if (top + height > window.innerHeight)
      newTop = top - Math.abs(top + height - window.innerHeight) - 10;

    return { left, top: newTop || top };
  };

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

  const postComponent = (
    <div className='container post-container' key={post.post_id}>
      <div className='post card card-post'>
        <ButtonLink text='[-]' altText='[+]' extraClass='hide-thread' />

        <div className='post-info'>
          <strong>{post.name || 'Anon'}</strong> {prettyDate(post.created_on).toLocaleString()}{' '}
          <span className='small'>({timeSince(post.created_on)}) </span>{' '}
          <a href={`/${board.uri}/t${thread.thread_id}#p${post.post_id}`}>No.</a>{' '}
          <a
            href={`/${board.uri}/t${thread.thread_id}#qp${post.post_id}`}
            onClick={() => onClick('qp', post.post_id)}
          >
            {post.post_id}
          </a>{' '}
          <a
            href={`/${board.uri}/t${thread.thread_id}#rp${post.post_id}`}
            onClick={() => onClick('rp', post.post_id)}
          >
            [!!!]
          </a>
        </div>

        <p className='file-info-post'>
          <span className='small'>
            {' '}
            {post.file && (
              <Fragment>
                File: {post.file.name + '.' + post.file.extension} ({prettyBytes(post.file.size)})
              </Fragment>
            )}
          </span>
        </p>

        <div className='post-file'>
          {post.file && (
            <Image
              className='post-image op'
              src={'/' + post.file.folder + '/' + post.file.name + '.' + post.file.extension}
            />
          )}
        </div>

        <div className='post-text'>{text}</div>
      </div>
    </div>
  );

  return postComponent;
};
