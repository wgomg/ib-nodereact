import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Route, Switch, useLocation } from 'react-router-dom';

import Thread from './Thread';
import ThreadsList from './ThreadsList';
import NotFound from '../NotFound';
import Banner from './Banner';
import BoardTitle from './BoardTitle';
import { Loading } from '../common';

import { getRules } from '../../actions/rules';

const Board = ({ getRules, boards: { boards, loading } }) => {
  const location = useLocation();
  const [boardUri, setBoardUri] = useState(null);

  useEffect(() => {
    setBoardUri(location.pathname.split('/')[1]);
  }, [location]);

  const [board, setBoard] = useState(null);

  let routes = [];

  boards.forEach((board) => {
    routes.push(
      <Route
        exact
        path={'/' + board.uri}
        render={(props) => <ThreadsList {...props} board={board} />}
        key={board.board_id}
      />
    );

    if (board.threadsIds)
      board.threadsIds.forEach((thread_id) => {
        routes.push(
          <Route
            exact
            path={'/' + board.uri + '/t' + thread_id}
            render={(props) => <Thread {...props} board={board} thread_id={thread_id} />}
            key={thread_id}
          />
        );
      });
  });

  routes.push(<NotFound key='notfound' />);

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
      {board && (
        <Fragment>
          <Banner board={board} />
          <BoardTitle board={board} />
        </Fragment>
      )}

      <Switch>{routes}</Switch>
    </Fragment>
  );
};

Board.propTypes = {
  boards: PropTypes.object.isRequired,
  getRules: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  boards: state.boards,
});

export default connect(mapStateToProps, { getRules })(Board);
