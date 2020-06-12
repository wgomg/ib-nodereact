import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { logout } from '../../actions/auth';

const Navbar = ({ logout, boards: { boards }, auth: { staff } }) => {
  const staffNav = staff ? (
    <Fragment>
      [{' '}
      <Link to='/staff/dash'>
        <span className={staff.admin ? 'admin' : 'mod'}>{staff.name}</span>
      </Link>{' '}
      ] [{' '}
      <Link to='/staff/login' onClick={logout}>
        Logout
      </Link>{' '}
      ]
    </Fragment>
  ) : (
    ''
  );

  return (
    <div className='container'>
      <p className='centered'>
        [ <Link to='/'>Home</Link> ] [{' '}
        {boards.length > 0 ? (
          boards.map((board, index) => (
            <Fragment key={board.board_id}>
              <Link to={`/${board.uri}/`}> {board.uri} </Link>
              {index !== boards.length - 1 ? ' / ' : ''}
            </Fragment>
          ))
        ) : (
          <small className='warning'>No hay boards para mostrar</small>
        )}{' '}
        ] {staffNav}
      </p>
    </div>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
