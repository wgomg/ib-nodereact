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
            <div className='col'>
              <span className='small'>[ borrar | editar ]</span>
            </div>
          );

          const role = staff.admin ? 'admin' : 'mod';
          const name = (
            <div className='col'>
              <span className={role}>{staff.name}</span>
            </div>
          );

          const board = (
            <div className='col'>
              {!staff.admin ? (staff.Boards.uri ? staff.Boards.uri : 'global') : ''}
            </div>
          );

          return (
            <li key={staff.staff_id}>
              <div className='columns'>
                {actions} {name} {board}
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

  return <Card title='Staff' content={cardContent} classes='col' />;
};

StaffsList.propTypes = {
  getStaffs: PropTypes.func.isRequired,
  staffs: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  staffs: state.staffs
});

export default connect(mapStateToProps, { getStaffs })(StaffsList);
