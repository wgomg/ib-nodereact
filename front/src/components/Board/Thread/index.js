import React, { Fragment, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link, useLocation } from 'react-router-dom';

import Post from '../Post';
import OpPost from '../OpPost';

import NewPost from './NewPost';
import ReportForm from './ReportForm';

import { getThread } from '../../../actions/threads';
import { createPost } from '../../../actions/threads';
import { createReport } from '../../../actions/reports';

import ReactTooltip from 'react-tooltip';
import { Loading } from '../../common';

const Thread = ({
  board,
  thread_id,
  threads: { thread, loading, error },
  rules: { rules },
  getThread,
  createPost,
  createReport,
  history,
}) => {
  let location = useLocation();
  const [boardUri, setBoardUri] = useState(null);
  const [urlHash, setUrlHash] = useState(null);

  const [newPostData, setNewPostData] = useState({
    thread_id: thread_id,
    text: '',
    name: 'Anon',
    file_url: '',
  });
  const [file, setFile] = useState(null);

  const [reportData, setReportData] = useState({
    post_id: 0,
    rule_id: 0,
  });
  const [tooltipData, setTooltipData] = useState({
    qp: null,
    rp: null,
  });
  const { qp, rp } = tooltipData;
  const [prevTooltipPost, setPrevTooltipPost] = useState({
    prevQp: null,
    prevRp: null,
  });

  const [scrolledOnRef, setScrolledOnRef] = useState(false);

  useEffect(() => {
    setBoardUri(location.pathname.split('/')[1]);
    setUrlHash(location.hash);
  }, [location]);

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

  useEffect(() => {
    setTooltipData((tooltipData) => {
      if (qp) return { ...tooltipData, qp };

      if (urlHash && urlHash.includes('#qp')) return { ...tooltipData, qp: urlHash.replace('#qp', '') };

      return tooltipData;
    });
  }, [qp, urlHash]);

  useEffect(() => {
    setTooltipData((tooltipData) => {
      if (rp) return { ...tooltipData, rp };

      if (urlHash && urlHash.includes('#rp')) return { ...tooltipData, rp: urlHash.replace('#rp', '') };

      return tooltipData;
    });
  }, [rp, urlHash]);

  useEffect(() => {
    setNewPostData((newPostData) =>
      qp ? { ...newPostData, text: (newPostData.text += `>>${qp}\n`) } : newPostData
    );
  }, [qp]);

  useEffect(() => {
    setReportData((reportData) => (rp ? { ...reportData, post_id: rp } : reportData));
  }, [rp]);

  const currRef = useRef(null);

  setTimeout(() => {
    if (urlHash && currRef.current && !scrolledOnRef) {
      window.scrollTo({ left: 0, top: currRef.current.offsetTop, behavior: 'smooth' });
      currRef.current.firstChild.firstChild.classList.add('hashed');

      if (urlHash.includes('#qp') || urlHash.includes('#rp')) {
        const key = urlHash.replace('#', '').replace(/\d+/g, '');
        openTooltip(key);
      }

      setScrolledOnRef(true);
    }
  }, 100);

  const onToolTipClick = (key, value) => {
    setTooltipData({ ...tooltipData, [key]: value });
    openTooltip(key);
    scrollToTooltipDiv(key, value);
  };

  const openTooltip = (key) => {
    const keyUp = key.charAt(0).toUpperCase() + 'p';

    const dummyDiv = document.getElementById('dummy' + keyUp);
    dummyDiv.click();
  };

  const scrollToTooltipDiv = (key, value) => {
    const keyUp = key.charAt(0).toUpperCase() + 'p';

    setTimeout(() => {
      const postDiv = document.getElementById(`p${value}`);

      const prevDiv = prevTooltipPost['prev' + keyUp];

      if (prevDiv && value !== prevDiv.id.replace('p', ''))
        prevDiv.firstChild.firstChild.classList.remove('hashed');

      setPrevTooltipPost({ ...prevTooltipPost, ['prev' + keyUp]: postDiv });

      postDiv.firstChild.firstChild.classList.add('hashed');

      window.scrollTo({ left: 0, top: postDiv.offsetTop, behavior: 'smooth' });
    }, 100);
  };

  const onPostChange = (e) => setNewPostData({ ...newPostData, [e.target.name]: e.target.value });

  const onReportChange = (e) =>
    setReportData({ ...reportData, [e.target.name]: parseInt(e.target.value) });

  const onFileSelected = (e) => setFile(e.target.files[0]);

  const onPostSubmit = async (e) => {
    e.preventDefault();

    const { thread_id, text, name, file_url } = newPostData;

    if (text === '') alert('El campo "Texto" es obligatorio');
    else {
      const newPost = new FormData();

      newPost.set('thread_id', thread_id);
      newPost.set('text', text);
      newPost.set('name', name);
      if (file) newPost.append('image', file);
      newPost.set('file_url', file_url);

      const res = await createPost(newPost);

      if (res) {
        setNewPostData({
          ...newPostData,
          text: '',
          name: 'Anon',
          file_url: '',
        });
        setFile(null);

        history.push(`/${boardUri}/t${thread_id}`);

        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const onReportSubmit = (e) => {
    e.preventDefault();

    const { rule_id } = reportData;

    if (rule_id === 0) alert('Selecciona una regla');
    else {
      const res = createReport(reportData);

      if (res) alert('Reporte enviado');
      else alert('Ocurrió un error, inténtalo de nuevo');
    }
  };

  const postsList =
    loading || !thread ? (
      <Loading />
    ) : (
      thread.posts.map((post, index) => {
        if (index === 0)
          return <OpPost thread={thread} board={board} post={post} isThread={true} key={index} />;

        let props = { id: 'p' + post.post_id, key: index };

        if (urlHash && urlHash.includes(post.post_id)) {
          if (currRef.current) currRef.current.firstChild.firstChild.classList.remove('hashed');

          props.ref = currRef;
        }

        return (
          <div {...props} key={index}>
            <Post thread={thread} board={board} post={post} onClick={onToolTipClick} />
          </div>
        );
      })
    );

  const tooltipOverridePosition = ({ left }, currentEvent, currentTarget, node) => {
    const { width: nodeWidth } = node.getBoundingClientRect();

    return { left: window.innerWidth - nodeWidth - 40 || left, top: 20 };
  };

  const qpProps = {
    'data-tip': true,
    'data-for': 'quotePost',
    'data-event': 'click',
    'data-iscapture': 'true',
    'data-scroll-hide': 'false',
  };

  const quotePost = (
    <ReactTooltip
      className='tooltip'
      id='quotePost'
      place='right'
      type='dark'
      effect='solid'
      clickable={true}
      globalEventOff='click'
      isCapture={true}
      overridePosition={tooltipOverridePosition}>
      <NewPost
        formData={newPostData}
        onChange={onPostChange}
        onFileSelected={onFileSelected}
        onSubmit={onPostSubmit}
        isFloatin={true}
      />
    </ReactTooltip>
  );

  const reportProps = {
    'data-tip': true,
    'data-for': 'reportForm',
    'data-event': 'click',
    'data-iscapture': 'true',
    'data-scroll-hide': 'false',
  };

  const reportTooltip = (
    <ReactTooltip
      className='tooltip'
      id='reportForm'
      place='right'
      type='dark'
      effect='solid'
      clickable={true}
      globalEventOff='click'
      isCapture={true}
      overridePosition={tooltipOverridePosition}>
      <ReportForm
        formData={reportData}
        onChange={onReportChange}
        onSubmit={onReportSubmit}
        rules={rules}
      />
    </ReactTooltip>
  );

  return (
    <Fragment>
      <NewPost
        formData={newPostData}
        onChange={onPostChange}
        onFileSelected={onFileSelected}
        onSubmit={onPostSubmit}
        isFloatin={false}
      />

      {postsList}

      <hr className='separator' />
      <div className='container centered'>[ {<Link to={`/${board.uri}/`}>return</Link>} ]</div>

      <div id='dummyQp' {...qpProps} style={{ display: 'none' }} />
      {quotePost}

      <div id='dummyRp' {...reportProps} style={{ display: 'none' }} />
      {reportTooltip}
    </Fragment>
  );
};

Thread.propTypes = {
  thread_id: PropTypes.number.isRequired,
  board: PropTypes.object.isRequired,
  threads: PropTypes.object.isRequired,
  getThread: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  createReport: PropTypes.func.isRequired,
  rules: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  threads: state.threads,
  rules: state.rules,
});

export default connect(mapStateToProps, { getThread, createPost, createReport })(Thread);
