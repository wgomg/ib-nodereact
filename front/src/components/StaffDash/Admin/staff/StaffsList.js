import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../../../common';
import { getStaffs, resetPassword } from '../../../../actions/staffs';

import timeSince from '../../../../utils/timeSince';

const StaffsList = ({ getStaffs, resetPassword, staffs: { staffs, loading }, auth: { staff } }) => {
  useEffect(() => {
    getStaffs();
  }, [getStaffs]);

  const staffsList =
    staffs.length > 0 ? (
      staffs
        .filter((s) => !s.admin || s.staff_id === staff.staff_id)
        .map((s) => {
          const editStaff = <Link to={`dash/edit-staff/${s.staff_id}`}>editar</Link>;
          const changePassword = <Link to={`dash/change-password/${s.staff_id}`}>contraseña</Link>;
          const resetPwd = (
            <Link to='/staff/dash' onClick={() => resetPassword(s)}>
              contraseña
            </Link>
          );

          const actions = (
            <div className='col-3'>
              <span className='small'>
                [ {editStaff} | {s.staff_id === staff.staff_id ? changePassword : resetPwd} ]
              </span>
            </div>
          );

          const role = s.admin ? 'admin' : 'mod';
          const name = (
            <div className='col'>
              <span className={role}>{s.name}</span>
            </div>
          );

          const board = (
            <div className='col-1'>
              {!s.disabled ? (!s.admin ? (s.board ? s.board.uri : 'global') : '') : 'x'}
            </div>
          );

          const lastLogin = <div className='col-2'>{timeSince(s.last_login)}</div>;

          return (
            <div className='columns' key={s.staff_id}>
              {actions} {name} {board} {lastLogin}
            </div>
          );
        })
    ) : (
      <h4 className='centered'>No hay Staff para mostrar</h4>
    );

  const newStaff = (
    <Link to='dash/create-staff'>
      <span className='new-item'>[ nuevo staff ]</span>
    </Link>
  );

  const cardContent = loading ? (
    <Loading />
  ) : (
    <Fragment>
      {staffsList}
      {newStaff}
    </Fragment>
  );

  return <Card title='Staff' content={cardContent} classes='col' />;
};

StaffsList.propTypes = {
  getStaffs: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  staffs: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  staffs: state.staffs,
  auth: state.auth,
});

export default connect(mapStateToProps, { getStaffs, resetPassword })(StaffsList);
