import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Loading, BoardTitle } from './elements';
import NewThreadForm from './NewThreadForm';
import { getBoard } from '../actions/boards';

import Banner from './Banner';

const Board = ({ getBoard, boards: { board, loading }, match }) => {
  useEffect(() => {
    getBoard(match.params.board_uri);
  }, [getBoard, match.params.board_uri]);

  const banner = loading || !board ? <Loading /> : <Banner board={board} />;

  const title = loading || !board ? <Loading /> : <BoardTitle board={board} />;

  const newThread = loading || !board ? <Loading /> : <NewThreadForm board={board} />;

  return (
    <Fragment>
      {banner}
      {title}
      {newThread}
    </Fragment>
  );
};

Board.propTypes = {
  getBoard: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boards: state.boards
});

export default connect(mapStateToProps, { getBoard })(Board);
