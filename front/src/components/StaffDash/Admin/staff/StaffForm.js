import React, { useState, Fragment, useEffect } from 'react';
import { withRouter, useHistory, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStaff, editStaff } from '../../../../actions/staffs';

import { Form } from '../../../common';

import alertError from '../../../../utils/alertError';

const StaffForm = ({
  staffs: { staffs, error },
  boards: { boards },
  auth: { staff: loggedStaff },
  createStaff,
  editStaff,
  mode,
}) => {
  let history = useHistory();
  let { staff_id } = useParams();
  if (mode === 'create') staff_id = null;

  const staff = staff_id ? staffs.filter((s) => s.staff_id === staff_id)[0] : null;

  const [formData, setFormData] = useState({
    staff_id: '',
    board_id: 0,
    name: '',
    admin: 0,
    disabled: 0,
  });

  useEffect(() => {
    setFormData((formData) =>
      !staff
        ? formData
        : {
            staff_id: staff.staff_id,
            board_id: staff.Boards && staff.Boards.board_id ? staff.Boards.board_id : 0,
            name: staff.name,
            admin: staff.admin,
            disabled: staff.disabled,
          }
    );
  }, [staff]);

  useEffect(() => {
    alertError(error);
  }, [error]);

  const { board_id, name, admin, disabled } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCheckChange = (field) => setFormData({ ...formData, [field]: !formData[field] });

  let boardsOptions = boards.map((board) => ({
    value: board.board_id,
    text: `/${board.uri} - ${board.name}`,
  }));

  let elements = [
    {
      component: 'text',
      name: 'name',
      value: name,
      label: 'Nombre',
      onChange: (e) => onChange(e),
    },
  ];

  if (mode === 'create' || (mode === 'edit' && loggedStaff.admin && loggedStaff.staff_id !== staff_id))
    elements = [
      ...elements,
      {
        component: 'select',
        name: 'board_id',
        value: board_id,
        options: !boards
          ? [{ value: 0, text: 'Boards' }]
          : [{ value: 0, text: 'Boards' }, ...boardsOptions],
        label: 'Board',
        onChange: (e) => onChange(e),
      },
      {
        component: 'check',
        name: 'admin',
        value: admin,
        label: 'Admin ¿?',
        onChange: () => onCheckChange('admin'),
      },
      {
        component: 'check',
        name: 'disabled',
        value: !disabled,
        label: 'Habilitado ¿?',
        onChange: () => onCheckChange('disabled'),
      },
    ];

  elements = [
    ...elements,
    {
      component: 'btn',
      type: 'submit',
      text: (mode === 'edit' ? 'Editar' : 'Nuevo') + ' Staff',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '') alert('El campo "Nombre" es obligatorio');
    else {
      if (admin || board_id === 0) formData.board_id = null;

      if (mode === 'edit') editStaff(formData, history);
      else {
        delete formData.staff_id;
        createStaff(formData, history);
      }
    }
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>{mode === 'edit' ? 'Editar' : 'Nuevo'} Staff</h2>
        {(mode === 'create' || (mode === 'edit' && staff_id === loggedStaff.staff_id)) && (
          <p className='centered'>
            <span className='small'>
              [ <Link to={`/staff/change-password/${staff_id}`}>cambiar contraseña</Link> ]
            </span>
          </p>
        )}
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

StaffForm.propTypes = {
  createStaff: PropTypes.func.isRequired,
  editStaff: PropTypes.func.isRequired,
  staffs: PropTypes.object.isRequired,
  boards: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  staffs: state.staffs,
  boards: state.boards,
  auth: state.auth,
});

export default connect(mapStateToProps, { createStaff, editStaff })(withRouter(StaffForm));
