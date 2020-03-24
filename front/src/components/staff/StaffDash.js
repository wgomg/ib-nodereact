import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AdminDash } from '.';
import { Loading } from '../common';
import { Redirect } from 'react-router-dom';

const StaffDash = ({ auth: { loading, logged, staff } }) => {
  return loading ? (
    <Loading />
  ) : logged ? (
    staff && staff.admin ? (
      <AdminDash />
    ) : (
      'ModDash'
    )
  ) : (
    <Redirect to='/' />
  );
};

StaffDash.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(StaffDash);
