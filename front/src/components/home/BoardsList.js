import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../common';
import { getBoardsList } from '../../actions/boards';

const BoardsList = ({ getBoardsList, boards: { boards, loading } }) => {
  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  const boardsList =
    !loading && boards ? (
      boards.map(board => (
        <div className='columns' key={board.board_id}>
          <div className='col-1'>
            <Link to={`/${board.uri}/`}>{`/${board.uri}/`}</Link>
          </div>
          <div className='col-2'>{board.name}</div>
          <div className='col'>{board.description}</div>
        </div>
      ))
    ) : (
      <h4 className='centered'>No hay Boards para mostrar</h4>
    );

  const cardContent = loading ? <Loading /> : boardsList;

  return <Card title='Boards' content={cardContent} classes='col' />;
};

BoardsList.propTypes = {
  getBoardsList: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boards: state.boards
});

export default connect(mapStateToProps, { getBoardsList })(BoardsList);
