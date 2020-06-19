import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import NewThread from './NewThread';
import ThreadPreview from '../ThreadPreview';
import { Empty, Loading } from '../../common';

import { getThreads } from '../../../actions/threads';

const ThreadList = ({ boards: { boards }, threads: { threads, loading, error }, getThreads }) => {
  const location = useLocation();
  const [boardUri, setBoardUri] = useState(null);

  useEffect(() => {
    setBoardUri(location.pathname.replace(/\//g, ''));
  }, [location]);

  const [board, setBoard] = useState({});
  const [page, setPage] = useState(0);
  const [btnVisited, setBtnVisited] = useState([]);

  const topThread = useRef(null);

  useEffect(() => {
    setBoard({ ...boards.filter((board) => board.uri === boardUri)[0] });
  }, [boards, boardUri]);

  useEffect(() => {
    if (board.board_id) getThreads(board.board_id);
  }, [board, getThreads]);

  const onClick = (page, topThread) => {
    setBtnVisited(btnVisited.map((btn, index) => index === page));
    setPage(page);

    window.scrollTo(0, topThread.current.offsetTop);
  };

  let pages = [];
  let pagesNum = 0;

  useEffect(() => {
    setBtnVisited(new Array(pagesNum).fill(false));
  }, [pagesNum]);

  let threadsList = <Empty element='Hilos' />;

  if (threads.length > 0) {
    let threadsPages = [];
    let threadsCopy = [...threads];

    while (threadsCopy.length > 0)
      threadsPages.push(
        threadsCopy
          .splice(0, 10)
          .map((thread, index) => (
            <ThreadPreview thread={thread} index={index} topThread={topThread} key={index} />
          ))
      );

    pages = threadsPages.map((list, index) => (
      <Fragment key={index}>
        <button
          className={'link' + (btnVisited[index] ? ' visited' : '')}
          onClick={() => onClick(index, topThread)}>
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
