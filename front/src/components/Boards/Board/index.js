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
import NotFound from '../../NotFound';

import { getBoard } from '../../../actions/boards';
import { getGlobalAndBoard } from '../../../actions/rules';

const Board = ({
  getBoard,
  getGlobalAndBoard,
  boards: { board, error, loading: boardLoading },
  rules: { rules, loading: rulesLoading },
  uri,
}) => {
  useEffect(() => {
    getBoard(uri);
  }, [getBoard, uri]);

  useEffect(() => {
    if (!boardLoading) getGlobalAndBoard(board.board_id);
  }, [getGlobalAndBoard, boardLoading, board]);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  });

  const threadViewRoutes = (
    <Fragment>
      {board.threads && (
        <Fragment>
          {board.threads.map((thread) => (
            <Route
              exact
              path={`/${uri}/t${thread.thread_id}`}
              render={(props) => (
                <Thread {...props} thread={thread} board={board} error={error} rules={rules} />
              )}
              key={thread.thread_id}
            />
          ))}
          <Route path='/*' component={NotFound} />
        </Fragment>
      )}
    </Fragment>
  );

  const pageView =
    boardLoading || rulesLoading ? (
      <Loading />
    ) : (
      <Fragment>
        <Banner board={board} />
        <BoardTitle board={board} />

        <NewThreadForm board={board} error={error} />

        <Switch>
          <Route
            exact
            path={'/' + uri}
            render={(props) => <ThreadsList {...props} threads={board.threads} board={board} />}
          />
          {threadViewRoutes}
        </Switch>
      </Fragment>
    );

  return pageView;
};

Board.propTypes = {
  getBoard: PropTypes.func.isRequired,
  getGlobalAndBoard: PropTypes.func.isRequired,
  rules: PropTypes.object.isRequired,
  boards: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
  rules: state.rules,
});

export default connect(mapStateToProps, { getBoard, getGlobalAndBoard })(Board);
