import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Route, Switch } from 'react-router-dom';

import Thread from './Thread';
import ThreadsList from './ThreadsList';
import NotFound from '../NotFound';
import Banner from './Banner';
import BoardTitle from './BoardTitle';
import { Loading, Navbar, Footer } from '../common';

import { getBoardsList } from '../../actions/boards';
import { getRules } from '../../actions/rules';

const Board = ({ getBoardsList, getRules, boards: { boards, loading }, auth: { staff } }) => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  let routes = [];

  boards.forEach((board) => {
    routes.push(<Route exact path={'/' + board.uri} component={ThreadsList} key={board.board_id} />);

    if (board.threadsIds)
      board.threadsIds.forEach((thread_id) => {
        routes.push(
          <Route exact path={'/' + board.uri + '/t' + thread_id} component={Thread} key={thread_id} />
        );
      });
  });

  routes.push(<NotFound key='notfound' />);

  const boardUri = window.location.pathname.split('/')[1];

  useEffect(() => {
    setBoard(boards.filter((board) => board.uri === boardUri));
  }, [boardUri, boards]);

  useEffect(() => {
    if (board && board.length > 0) getRules(board[0].board_id);
  }, [getRules, board]);

  return loading ? (
    <Loading />
  ) : (
    <Fragment>
      <Navbar boards={boards} staff={staff} />
      {board && (
        <Fragment>
          <Banner board={board} />
          <BoardTitle board={board} />
        </Fragment>
      )}

      <Switch>{routes}</Switch>

      <Footer />
    </Fragment>
  );
};

Board.propTypes = {
  getBoardsList: PropTypes.func.isRequired,
  getRules: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
  auth: state.auth,
});

export default connect(mapStateToProps, { getBoardsList, getRules })(Board);
