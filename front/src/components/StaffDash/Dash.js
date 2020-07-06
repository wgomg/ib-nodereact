import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Admin from './Admin';
import Moderator from './Moderator';
import { Loading } from '../common';
import { Redirect } from 'react-router-dom';

const Dash = ({ auth: { loading, logged, staff } }) =>
  loading ? (
    <Loading />
  ) : logged ? (
    staff && staff.admin ? (
      <Admin />
    ) : (
      <Moderator board_id={staff.board_id} staff_id={staff.staff_id} />
    )
  ) : (
    <Redirect to='/' />
  );

Dash.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Dash);
