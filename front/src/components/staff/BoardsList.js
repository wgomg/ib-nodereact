import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../common';
import { getBoardsList, deleteBoard } from '../../actions/boards';

const BoardsList = ({ getBoardsList, deleteBoard, boards: { boards, loading } }) => {
  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  const boardsList =
    !loading && boards ? (
      <ul className='no-style col'>
        {boards.map(board => {
          const delBoard = (
            <Link to='/staff/dash' onClick={e => deleteBoard(board.board_id)}>
              borrar
            </Link>
          );

          const editBoard = <Link to={`edit-board/${board.uri}`}>editar</Link>;

          const actions = (
            <div className='col-1'>
              <span className='small'>
                [ {delBoard} | {editBoard} ]
              </span>
            </div>
          );

          const uri = <div className='col-1'>{board.uri}</div>;

          const name = <div className='col-1'>{board.name}</div>;

          const description = <div className='col-2'>{board.description}</div>;

          return (
            <li key={board.board_id}>
              <div className='columns'>
                {actions} {uri} {name} {description}
              </div>
            </li>
          );
        })}

        <li>
          <Link to='create-board'>
            <span className='new-item'>[ nuevo board ]</span>
          </Link>
        </li>
      </ul>
    ) : (
      <h4 className='centered'>No hay board para mostrar</h4>
    );

  const cardContent = loading ? <Loading /> : boardsList;

  return (
    <div className='container centered'>
      <Card title='Boards' content={cardContent} />
    </div>
  );
};

BoardsList.propTypes = {
  getBoardsList: PropTypes.func.isRequired,
  deleteBoard: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boards: state.boards
});

export default connect(mapStateToProps, { getBoardsList, deleteBoard })(BoardsList);
