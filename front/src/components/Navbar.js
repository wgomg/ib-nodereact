import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Loading } from './elements';
import { getBoardsList } from '../actions/boards';

const Navbar = ({ getBoardsList, boards: { boards, loading } }) => {
  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  const boardsList =
    boards.length > 0 ? (
      <Fragment>
        [{' '}
        {boards.map((board, index) => (
          <Fragment key={board.board_id}>
            <Link to={`/${board.uri}/`}> {board.uri} </Link>
            {index !== boards.length - 1 ? ' / ' : ''}
          </Fragment>
        ))}{' '}
        ]
      </Fragment>
    ) : (
      <h4 className='centered'>No hay Boards para mostrar</h4>
    );

  const navbar = loading ? (
    <Loading />
  ) : (
    <p className='centered'>
      [ <Link to='/'>Home</Link> ] {boardsList}
    </p>
  );

  return <div className='container centered'>{navbar}</div>;
};

Navbar.propTypes = {
  getBoardsList: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boards: state.boards
});

export default connect(mapStateToProps, { getBoardsList })(Navbar);
