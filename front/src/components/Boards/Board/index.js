import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { Loading } from '../../common';

import Banner from './Banner';
import BoardTitle from './BoardTitle';
import NewThreadForm from './NewThreadForm';
import ThreadsList from './ThreadsList';
import Thread from './Thread';

import { getBoard } from '../../../actions/boards';

const Board = ({ getBoard, boards: { board, loading }, uri }) => {
  useEffect(() => {
    getBoard(uri);
  }, [getBoard, uri]);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  });

  const newThreadRoute = (
    <Route exact path={'/' + uri} render={(props) => <NewThreadForm {...props} board={board} />} />
  );

  const threadsListRoute = (
    <Route
      exact
      path={'/' + uri}
      render={(props) => <ThreadsList {...props} threads={board.threads} board={board} />}
    />
  );

  const threadViewRoutes = (
    <Fragment>
      {board.threads && (
        <Fragment>
          {board.threads.map((thread) => (
            <Route
              exact
              path={`/${uri}/t${thread.thread_id}`}
              render={(props) => <Thread {...props} thread={thread} board={board} />}
              key={thread.thread_id}
            />
          ))}
        </Fragment>
      )}
    </Fragment>
  );

  const pageView = loading ? (
    <Loading />
  ) : (
    <Fragment>
      <Banner board={board} />
      <BoardTitle board={board} />

      <Switch>{newThreadRoute}</Switch>

      <Switch>
        {threadsListRoute}
        {threadViewRoutes}
      </Switch>
    </Fragment>
  );

  return pageView;
};

Board.propTypes = {
  getBoard: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
});

export default connect(mapStateToProps, { getBoard })(Board);
