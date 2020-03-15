import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AdminDash } from './staff';
import { Loading } from './common';

const StaffDash = ({ auth: { loading, staff } }) => {
  const dash = loading ? <Loading /> : staff && staff.admin ? <AdminDash /> : 'ModDash';

  return dash;
};

StaffDash.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(StaffDash);
