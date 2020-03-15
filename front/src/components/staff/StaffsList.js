import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../common';
import { getStaffs } from '../../actions/staffs';

const StaffsList = ({ getStaffs, staffs: { staffs, loading } }) => {
  useEffect(() => {
    getStaffs();
  }, [getStaffs]);

  const staffsList =
    !loading && staffs ? (
      <ul className='no-style col'>
        {staffs.map(staff => {
          const actions = (
            <div className='col-1'>
              <span className='small'>[ borrar | editar | deshabilitar ]</span>
            </div>
          );

          const role = staff.admin ? 'admin' : 'mod';
          const name = (
            <div className='col-1'>
              <span className={role}>{staff.name}</span>
            </div>
          );

          const email = (
            <div className='col-1'>
              <span>{staff.email}</span>
            </div>
          );

          const board = (
            <div className='col-1'>
              {!staff.admin ? (staff.Boards.uri ? staff.Boards.uri : 'global') : ''}
            </div>
          );

          const someOtherInfo = <div className='col-1'></div>;

          return (
            <li key={staff.staff_id}>
              <div className='columns'>
                {actions} {name} {email} {board} {someOtherInfo}
              </div>
            </li>
          );
        })}
        <li>
          <Link to='create-staff'>
            <span className='new-item'>[ nuevo staff ]</span>
          </Link>
        </li>
      </ul>
    ) : (
      <h4 className='centered'>No hay Staff para mostrar</h4>
    );

  const cardContent = loading ? <Loading /> : staffsList;

  return (
    <div className='container centered'>
      <Card title='Staff' content={cardContent} />
    </div>
  );
};

StaffsList.propTypes = {
  getStaffs: PropTypes.func.isRequired,
  staffs: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  staffs: state.staffs
});

export default connect(mapStateToProps, { getStaffs })(StaffsList);
