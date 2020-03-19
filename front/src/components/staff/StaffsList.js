import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../common';
import { getStaffs, deleteStaff } from '../../actions/staffs';

import timeSince from '../../utils/timeSince';

const StaffsList = ({ getStaffs, deleteStaff, staffs: { staffs, loading } }) => {
  useEffect(() => {
    getStaffs();
  }, [getStaffs]);

  const staffsList =
    !loading && staffs ? (
      staffs.map(staff => {
        const delStaff = (
          <Link to='/staff/dash' onClick={e => deleteStaff(staff.staff_id)}>
            borrar
          </Link>
        );

        const editStaff = <Link to={`edit-staff/${staff.staff_id}`}>editar</Link>;

        const actions = (
          <div className='col-2'>
            <span className='small'>
              [ {delStaff} | {editStaff} ]
            </span>
          </div>
        );

        const role = staff.admin ? 'admin' : 'mod';
        const name = (
          <div className='col-2'>
            <span className={role}>{staff.name}</span>
          </div>
        );

        const board = (
          <div className='col-2'>
            {!staff.admin ? (staff.Boards.uri ? staff.Boards.uri : 'global') : ''}
          </div>
        );

        const lastLogin = <div className='col'>{timeSince(staff.last_login)}</div>;

        return (
          <div className='columns' key={staff.staff_id}>
            {actions} {name} {board} {lastLogin}
          </div>
        );
      })
    ) : (
      <h4 className='centered'>No hay Staff para mostrar</h4>
    );

  const newStaff = (
    <Link to='create-staff'>
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
  deleteStaff: PropTypes.func.isRequired,
  staffs: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  staffs: state.staffs
});

export default connect(mapStateToProps, { getStaffs, deleteStaff })(StaffsList);
