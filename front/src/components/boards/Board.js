import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { Loading } from '../common';

import Banner from './board/Banner';
import BoardTitle from './board/BoardTitle';
import NewThreadForm from './board/NewThreadForm';
import NewPostForm from './board/NewPostForm';
import ThreadsList from './board/ThreadsList';
import Thread from './board/Thread';

import { getBoard } from '../../actions/boards';

const Board = ({ getBoard, boards: { board, loading }, uri }) => {
  useEffect(() => {
    getBoard(uri);
  }, [getBoard, uri]);

  let boardView = <Loading />;

  if (!loading && board) {
    const threadsRoutes = (
      <Fragment>
        {board.threads && (
          <Fragment>
            {board.threads.map(thread => (
              <Route
                exact
                path={`/${uri}/t${thread.thread_id}`}
                render={props => <Thread {...props} thread={thread} />}
                key={thread.thread_id}
              />
            ))}
          </Fragment>
        )}
      </Fragment>
    );

    const newPostForms = (
      <Fragment>
        {board.threads && (
          <Fragment>
            {board.threads.map(thread => (
              <Route
                exact
                path={`/${uri}/t${thread.thread_id}`}
                render={props => <NewPostForm {...props} thread={thread} boardUri={uri} />}
                key={thread.thread_id}
              />
            ))}
          </Fragment>
        )}
      </Fragment>
    );

    boardView = (
      <Fragment>
        <Banner board={board} />
        <BoardTitle board={board} />
        <Switch>
          <Route exact path={'/' + uri} render={props => <NewThreadForm {...props} board={board} />} />
          {newPostForms}
        </Switch>
        <Switch>
          <Route
            exact
            path={'/' + uri}
            render={props => <ThreadsList {...props} threads={board.threads} />}
          />
          {threadsRoutes}
        </Switch>
      </Fragment>
    );
  }

  return boardView;
};

Board.propTypes = {
  getBoard: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  boards: state.boards
});

export default connect(mapStateToProps, { getBoard })(Board);
