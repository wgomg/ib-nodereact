import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../../../common';
import { getBoardsList, deleteBoard } from '../../../../actions/boards';

import ReactTooltip from 'react-tooltip';

const BoardsList = ({ getBoardsList, deleteBoard, boards: { boards, loading } }) => {
  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  const boardsList =
    !loading && boards ? (
      boards.map((board) => {
        const delBoard = (
          <Link to='/staff/dash' onClick={(e) => deleteBoard(board.board_id)}>
            borrar
          </Link>
        );

        const editBoard = <Link to={`dash/edit-board/${board.uri}`}>editar</Link>;

        const actions = (
          <div className='col-2'>
            <span className='small'>
              [ {delBoard} | {editBoard} ]
            </span>
          </div>
        );

        const uri = <div className='col-1'>{board.uri}</div>;

        const name = (
          <div className='col' data-tip={board.description}>
            {board.name}
          </div>
        );

        return (
          <div className='columns' key={board.board_id}>
            {actions} {uri} {name}
          </div>
        );
      })
    ) : (
      <h4 className='centered'>No hay board para mostrar</h4>
    );

  const newBoard = (
    <Link to='dash/create-board'>
      <span className='new-item'>[ nuevo board ]</span>
    </Link>
  );

  const cardContent = loading ? (
    <Loading />
  ) : (
    <Fragment>
      {boardsList}
      {newBoard}
      <ReactTooltip border={true} borderColor='#7da3b3' />
    </Fragment>
  );

  return <Card title='Boards' content={cardContent} classes='col' />;
};

BoardsList.propTypes = {
  getBoardsList: PropTypes.func.isRequired,
  deleteBoard: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
});

export default connect(mapStateToProps, { getBoardsList, deleteBoard })(BoardsList);
