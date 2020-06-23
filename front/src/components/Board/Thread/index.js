import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link, useLocation } from 'react-router-dom';

import Post from '../Post';
import OpPost from '../OpPost';

import NewPost from './NewPost';

import { Loading } from '../../common';
import ReactTooltip from 'react-tooltip';

import ReportForm from './ReportForm';

import { getThread } from '../../../actions/threads';

const Thread = ({ board, thread_id, threads: { thread, loading, error }, getThread }) => {
  useEffect(() => {
    getThread(thread_id);
  }, [thread_id, getThread]);

  useEffect(() => {
    if (error)
      alert(
        Object.keys(error)
          .map((field) => `${field}: ${error[field]}`)
          .join('\n')
      );
  }, [error]);

  const [formData, setFormData] = useState({
    report: {
      post_id: 0,
      rule_id: '0',
    },
    newPost: {
      thread_id: 0,
      text: '',
      name: 'Anon',
      file_url: '',
      image: null,
    },
  });

  const location = useLocation();
  const [tooltipOpen, setTooltipOpen] = useState(null);

  useEffect(() => {
    if (location.hash) setTooltipOpen(location.hash.replace(/[#\d]/g, ''));
  }, [location]);

  useEffect(() => {
    if (tooltipOpen) openTooltip(tooltipOpen);
  }, [tooltipOpen]);

  const onOpenTooltipClick = (tooltip, tooltipData) => {
    if (tooltip === 'qp')
      tooltipData = {
        newPost: {
          ...formData.newPost,
          ...tooltipData.newPost,
          text: (formData.newPost.text += `${tooltipData.newPost.text}\n`),
        },
      };

    setFormData({
      ...formData,
      ...tooltipData,
    });

    openTooltip(tooltip);
  };

  const openTooltip = (tooltip) => {
    setTimeout(() => {
      const dummy = document.getElementById('dummy-' + tooltip);
      if (dummy) dummy.click();
    }, 100);
  };

  const postsList =
    loading || !thread ? (
      <Loading />
    ) : (
      thread.posts.map((post, index) =>
        index === 0 ? (
          <OpPost
            thread={thread}
            post={post}
            isThread={true}
            key={post.post_id}
            onOpenTooltipClick={onOpenTooltipClick}
          />
        ) : (
          <Post thread={thread} post={post} key={post.post_id} onOpenTooltipClick={onOpenTooltipClick} />
        )
      )
    );

  const tooltipOverridePosition = ({ left }, currentEvent, currentTarget, node) => {
    const { width: nodeWidth } = node.getBoundingClientRect();

    return { left: window.innerWidth - nodeWidth - 40 || left, top: 20 };
  };

  const reportTooltip = (
    <ReactTooltip
      className='tooltip'
      id={tooltipOpen}
      place='right'
      type='dark'
      effect='solid'
      clickable={true}
      globalEventOff='click'
      isCapture={true}
      overridePosition={tooltipOverridePosition}>
      {tooltipOpen === 'rp' && <ReportForm formData={formData} setFormData={setFormData} />}
      {tooltipOpen === 'qp' && (
        <NewPost formData={formData} setFormData={setFormData} isFloatin={true} />
      )}
      <div
        id={'dummy-' + tooltipOpen}
        data-event='click'
        data-iscapture={true}
        data-scroll-hide={false}
        data-tip={true}
        data-for={tooltipOpen}
        style={{ display: 'none' }}
      />
    </ReactTooltip>
  );

  return (
    <Fragment>
      <NewPost formData={formData} setFormData={setFormData} />

      {postsList}

      <hr className='separator' />
      <div className='container centered'>[ {<Link to={`/${board.uri}/`}>return</Link>} ]</div>

      {reportTooltip}
    </Fragment>
  );
};

Thread.propTypes = {
  thread_id: PropTypes.number.isRequired,
  board: PropTypes.object.isRequired,
  threads: PropTypes.object.isRequired,
  getThread: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  threads: state.threads,
});

export default connect(mapStateToProps, { getThread })(Thread);
