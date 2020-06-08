import React, { Fragment, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import Post from '../Post';
import OpPost from '../OpPost';

import NewPost from './NewPost';
import ReportForm from './ReportForm';

import { getThread } from '../../../actions/threads';
import { createPost } from '../../../actions/threads';
import { createReport } from '../../../actions/reports';

import ReactTooltip from 'react-tooltip';

const Thread = ({
  boards: { boards },
  threads: { thread, loading, error },
  rules: { rules },
  getThread,
  createPost,
  createReport,
  history,
}) => {
  const thread_id = parseInt(window.location.pathname.split('/')[2].replace(/\w/, ''));
  const boardUri = window.location.pathname.split('/')[1];

  useEffect(() => {
    getThread(thread_id);
  }, [thread_id, getThread]);

  const [board, setBoard] = useState({});
  const [hidden, setHidden] = useState(localStorage.getItem('hidden').split(',') || [0]);

  useEffect(() => {
    setBoard({ ...boards.filter((board) => board.uri === boardUri)[0] });
  }, [boards, boardUri]);

  const hash = window.location.hash;

  const [newPostData, setNewPostData] = useState({
    thread_id: 0,
    text: '',
    name: 'Anon',
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

  const [prevTooltipPost, setPrevTooltipPost] = useState({
    prevQp: null,
    prevRp: null,
  });

  const { qp, rp } = tooltipData;

  useEffect(() => {
    setNewPostData((newPostData) => ({ ...newPostData, thread_id: thread.thread_id }));
  }, [thread]);

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

      if (hash.includes('#qp')) return { ...tooltipData, qp: hash.replace('#qp', '') };

      return tooltipData;
    });
  }, [qp, hash]);

  useEffect(() => {
    setTooltipData((tooltipData) => {
      if (rp) return { ...tooltipData, rp };

      if (hash.includes('#rp')) return { ...tooltipData, rp: hash.replace('#rp', '') };

      return tooltipData;
    });
  }, [rp, hash]);

  useEffect(() => {
    setNewPostData((newPostData) =>
      qp ? { ...newPostData, text: (newPostData.text += `>>${qp}\n`) } : newPostData
    );
  }, [qp]);

  useEffect(() => {
    setReportData((reportData) => (rp ? { ...reportData, post_id: rp } : reportData));
  }, [rp]);

  setTimeout(() => {
    if (hash && currRef.current) {
      window.scrollTo({ left: 0, top: currRef.current.offsetTop, behavior: 'smooth' });
      currRef.current.firstChild.firstChild.classList.add('hashed');

      if (hash.includes('#qp') || hash.includes('#rp')) {
        const key = hash.replace('#', '').replace(/\d+/g, '');
        openTooltip(key);
      }
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

    const { thread_id, text, name } = newPostData;

    if (text === '') alert('El campo "Texto" es obligatorio');
    else {
      const newPost = new FormData();

      newPost.set('thread_id', thread_id);
      newPost.set('text', text);
      newPost.set('name', name);
      if (file) newPost.append('image', file);

      const res = await createPost(newPost);

      if (res) {
        setNewPostData({
          ...newPostData,
          text: '',
          name: 'Anon',
        });

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

  const onHiddenClick = (id) => {
    if (hidden.includes(id)) setHidden(hidden.filter((hide) => hide !== id));
    else setHidden([...hidden, id]);
  };

  useEffect(() => {
    localStorage.setItem('hidden', hidden);
  }, [hidden]);

  let posts = loading ? [] : [...thread.posts];

  const currRef = useRef(null);

  const opPost = posts.length > 0 && (
    <OpPost thread={thread} board={board} post={posts[0]} isThread={true} />
  );

  const postsList = posts.splice(1).map((post, index) => {
    let props = { id: 'p' + post.post_id, key: index };

    if (hash && hash.includes(post.post_id)) {
      if (currRef.current) currRef.current.firstChild.firstChild.classList.remove('hashed');

      props.ref = currRef;
    }

    return (
      <div {...props}>
        <Post
          thread={thread}
          board={board}
          post={post}
          onClick={onToolTipClick}
          onHiddenClick={() => onHiddenClick('p' + post.post_id)}
          isHidden={hidden.includes('p' + post.post_id)}
        />
      </div>
    );
  });

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
      overridePosition={tooltipOverridePosition}
    >
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
      overridePosition={tooltipOverridePosition}
    >
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
      {opPost}
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
  threads: PropTypes.object.isRequired,
  getThread: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  createPost: PropTypes.func.isRequired,
  createReport: PropTypes.func.isRequired,
  rules: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  threads: state.threads,
  boards: state.boards,
  rules: state.rules,
});

export default connect(mapStateToProps, { getThread, createPost, createReport })(Thread);