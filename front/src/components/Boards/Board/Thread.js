import React, { Fragment, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import Post from './Post';
import OpPost from './OpPost';

import NewPostForm from '../Board/NewPostForm';

import { createPost } from '../../../actions/boards';

import ReactTooltip from 'react-tooltip';

const Thread = ({ thread, board, createPost }) => {
  const [formData, setFormData] = useState({
    thread_id: 0,
    text: '',
    name: 'Anon',
  });

  const [qp, setQp] = useState(null);
  const [prevQp, setPrevQp] = useState(null);

  useEffect(() => {
    setFormData((formData) => {
      return { ...formData, thread_id: thread.thread_id };
    });
  }, [thread]);

  const [file, setFile] = useState(null);

  const hash = window.location.hash;

  const sessionQp =
    sessionStorage.getItem('qp') || (hash.includes('#qp') ? hash.replace('#qp', '') : null);
  useEffect(() => {
    setQp(sessionQp);
  }, [sessionQp]);

  useEffect(() => {
    setFormData((formData) => (qp ? { ...formData, text: (formData.text += `>>${qp}\n`) } : formData));
  }, [qp]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileSelected = (e) => setFile(e.target.files[0]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const { thread_id, text, name } = formData;

    if (text === '') alert('El campo "Texto" es obligatorio');
    else {
      const newPost = new FormData();

      newPost.set('thread_id', thread_id);
      newPost.set('text', text);
      newPost.set('name', name);
      if (file) newPost.append('image', file);

      const res = await createPost(newPost);
      if (res) {
        setFormData({
          thread_id: 0,
          text: '',
          name: 'Anon',
        });

        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  let posts = [...thread.posts];

  const currRef = useRef(null);

  const opPost = <OpPost thread={thread} post={posts[0]} isThread={true} />;

  const postsList = posts.splice(1).map((post, index) => {
    let props = { id: 'p' + post.post_id, key: index };

    if (hash && hash.includes('#qp') && currRef.current)
      currRef.current.firstChild.firstChild.classList.remove('hashed');

    if (hash && hash.includes(`#p${post.post_id}`)) {
      if (currRef.current) currRef.current.firstChild.firstChild.classList.remove('hashed');

      props.ref = currRef;
    }

    return (
      <div {...props}>
        <Post thread={thread} post={post} isThread={true} />
      </div>
    );
  });

  setTimeout(() => {
    if (hash && currRef.current) {
      window.scrollTo({ left: 0, top: currRef.current.offsetTop, behavior: 'smooth' });
      currRef.current.firstChild.firstChild.classList.add('hashed');
    }
  }, 100);

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
      overridePosition={tooltipOverridePosition}
      globalEventOff='click'
    >
      <NewPostForm
        formData={formData}
        onChange={onChange}
        onFileSelected={onFileSelected}
        onSubmit={onSubmit}
        isFloatin={true}
      />
      ;
    </ReactTooltip>
  );

  useEffect(() => {
    if (qp) {
      const dummy = document.getElementById('dummy');
      dummy.click();
      setTimeout(() => {
        const qpDiv = document.getElementById(`p${qp}`);
        setPrevQp(qpDiv);
        qpDiv.firstChild.firstChild.classList.add('hashed');
        window.scrollTo({ left: 0, top: qpDiv.offsetTop, behavior: 'smooth' });
        sessionStorage.removeItem('qp');
      }, 100);
    }
  }, [qp]);

  useEffect(() => {
    if (prevQp && qp !== prevQp.id.replace('p', ''))
      prevQp.firstChild.firstChild.classList.remove('hashed');
  }, [prevQp, qp]);

  return (
    <Fragment>
      <NewPostForm
        formData={formData}
        onChange={onChange}
        onFileSelected={onFileSelected}
        onSubmit={onSubmit}
        isFloatin={false}
      />
      {opPost}
      {postsList}
      <hr className='separator' />
      <div className='container centered'>[ {<Link to={`/${board.uri}/`}>return</Link>} ]</div>

      <div id='dummy' {...qpProps} style={{ display: 'none' }} />
      {quotePost}
    </Fragment>
  );
};

Thread.propTypes = {
  thread: PropTypes.object.isRequired,
  board: PropTypes.object.isRequired,
  createPost: PropTypes.func.isRequired,
};

export default connect(null, { createPost })(Thread);
