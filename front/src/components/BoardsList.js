import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from './elements';
import { getBoardsList } from '../actions/boards';

const BoardsList = ({ getBoardsList, boards: { boards, loading } }) => {
  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  const boardsList =
    boards.length > 0 ? (
      <ul className='no-style col'>
        {boards.map(board => (
          <li key={board.board_id}>
            <Link to={`/${board.uri}/`}>{`/${board.uri}/`}</Link> - {board.name} - {board.description}
          </li>
        ))}
      </ul>
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
