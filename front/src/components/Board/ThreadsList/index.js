import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Post from '../Post';
import OpPost from '../OpPost';
import NewThread from './NewThread';
import { Empty, Loading } from '../../common';

import { getThreads } from '../../../actions/threads';

const ThreadList = ({ boards: { boards }, threads: { threads, loading, error }, getThreads }) => {
  const [board, setBoard] = useState({});
  const [page, setPage] = useState(0);
  const [btnVisited, setBtnVisited] = useState([]);
  const [hidden, setHidden] = useState(localStorage.getItem('hidden').split(',') || [0]);

  const topThread = useRef(null);

  const boardUri = window.location.pathname.replace(/\//g, '');

  useEffect(() => {
    setBoard({ ...boards.filter((board) => board.uri === boardUri)[0] });
  }, [boards, boardUri]);

  useEffect(() => {
    if (board.board_id) getThreads(board.board_id);
  }, [board, getThreads]);

  useEffect(() => {
    localStorage.setItem('hidden', hidden);
  }, [hidden]);

  const onClick = (page, topThread) => {
    setBtnVisited(btnVisited.map((btn, index) => index === page));
    setPage(page);

    window.scrollTo(0, topThread.current.offsetTop);
  };

  const onHiddenClick = (id) => {
    if (hidden.includes(id)) setHidden(hidden.filter((hide) => hide !== id));
    else setHidden([...hidden, id]);
  };

  let pages = [];
  let pagesNum = 0;

  useEffect(() => {
    setBtnVisited(new Array(pagesNum).fill(false));
  }, [pagesNum]);

  let threadsList = <Empty element='Hilos' />;

  if (threads.length > 0) {
    let threadsCopy = [...threads];
    let threadsPages = [];

    while (threadsCopy.length > 0)
      threadsPages.push(
        threadsCopy.splice(0, 10).map((thread, index) => {
          let postsList =
            thread.posts.length > 1
              ? thread.posts.slice(Math.max(thread.posts.length - 5, 1)).map((post) => (
                  <div id={'p' + post.post_id} key={post.post_id}>
                    <Post
                      thread={thread}
                      board={board}
                      post={post}
                      onHiddenClick={() => onHiddenClick('p' + post.post_id)}
                      isHidden={hidden.includes('p' + post.post_id)}
                    />
                  </div>
                ))
              : '';

          const hiddenPosts = thread.hiddenPosts;
          let isHidden = hidden.includes('t' + thread.thread_id);

          let props = {
            thread,
            board,
            post: thread.posts[0],
            isThread: false,
            hideButton: true,
            onClick: () => onHiddenClick('t' + thread.thread_id),
            isHidden,
          };
          if (hiddenPosts > 0) props.hiddenPosts = hiddenPosts;

          const opPost = <OpPost {...props} />;

          let divProps = {
            className: 'container thread-preview',
            id: 't' + thread.thread_id,
            key: thread.thread_id,
          };

          if (index === 0) divProps.ref = topThread;

          return (
            <div {...divProps}>
              {opPost}
              {!isHidden && postsList}
            </div>
          );
        })
      );

    pages = threadsPages.map((list, index) => (
      <Fragment key={index}>
        <button
          className={'link' + (btnVisited[index] ? ' visited' : '')}
          onClick={() => onClick(index, topThread)}
        >
          {index + 1}
        </button>
        {index !== threadsPages.length - 1 ? ' / ' : ''}
      </Fragment>
    ));

    pagesNum = pages.length;

    threadsList = threadsPages[page];
  }

  return loading ? (
    <Loading />
  ) : (
    <Fragment>
      <NewThread board={board} error={error} />
      {threadsList}
      {pages.length > 0 && (
        <div className='container centered pages'>
          <hr className='separator' />
          <p className='centered'>
            [ {pages} ] [ <Link to='/'>Home</Link> ]{' '}
          </p>
        </div>
      )}
    </Fragment>
  );
};

ThreadList.propTypes = {
  boards: PropTypes.object.isRequired,
  threads: PropTypes.object.isRequired,
  getThreads: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
  threads: state.threads,
  rules: state.rules,
});

export default connect(mapStateToProps, { getThreads })(ThreadList);
