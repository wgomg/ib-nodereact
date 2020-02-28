import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Loading } from './elements';
import { getBoard } from '../actions/boards';

import Banner from './Banner';

const Board = ({ getBoard, boards: { board, loading }, match }) => {
  useEffect(() => {
    getBoard(match.params.board_uri);
  }, [getBoard, match.params.board_uri]);

  const banner = loading || board.length == 0 ? <Loading /> : <Banner board={board} />;

  return (
    <Fragment>
      {banner}
      <div>BOARD</div>
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
