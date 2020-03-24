import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Loading } from '../common';

import Banner from './board/Banner';
import BoardTitle from './board/BoardTitle';
import NewThreadForm from './board/NewThreadForm';
import ThreadsList from './board/ThreadsList';

import { getBoard } from '../../actions/boards';

const Board = ({ getBoard, boards: { board, loading }, uri }) => {
  useEffect(() => {
    getBoard(uri);
  }, [getBoard, uri]);

  let boardView = <Loading />;

  if (!loading && board)
    boardView = (
      <Fragment>
        <Banner board={board} />
        <BoardTitle board={board} />
        <NewThreadForm board={board} />
        <ThreadsList board={board} />
      </Fragment>
    );

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
