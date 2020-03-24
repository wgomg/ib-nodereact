import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Loading } from '../common';

import { logout } from '../../actions/auth';

const StaffNavbar = ({ logout, auth: { loading, staff } }) => {
  const homeLink = (
    <Fragment>
      [ <Link to='/'>Home</Link> ]
    </Fragment>
  );

  const role = staff ? (staff.admin ? 'admin' : 'mod') : '';
  const name = staff ? staff.name : '';

  const nameTag = (
    <Fragment>
      [{' '}
      <Link to='/staff/dash'>
        <span className={role}>{name}</span>
      </Link>{' '}
      ]
    </Fragment>
  );

  const logoutLink = (
    <Fragment>
      [{' '}
      <Link to='/staff/login' onClick={logout}>
        Logout
      </Link>{' '}
      ]
    </Fragment>
  );

  const navbar = (
    <p className='centered'>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          {homeLink} {nameTag} {logoutLink}
        </Fragment>
      )}
    </p>
  );

  return <div className='container centered'>{navbar}</div>;
};

StaffNavbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(StaffNavbar);
