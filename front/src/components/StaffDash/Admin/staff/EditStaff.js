import React, { useState, Fragment, useEffect } from 'react';
import { withRouter, useHistory, Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { editStaff } from '../../../../actions/staffs';

import { Form } from '../../../common';

const EditStaff = ({
  staffs: { staffs, error },
  boards: { boards },
  auth: { staff: loggedStaff },
  editStaff,
}) => {
  let history = useHistory();

  let { staff_id } = useParams();

  const staff = staffs.filter((s) => s.staff_id === staff_id)[0];

  const [formData, setFormData] = useState({
    staff_id: staff_id,
    board_id: 0,
    name: '',
    admin: 0,
    disabled: 0,
  });

  useEffect(() => {
    setFormData((formData) => {
      return !staff
        ? formData
        : {
            staff_id: staff.staff_id,
            board_id: staff.Boards && staff.Boards.board_id ? staff.Boards.board_id : 0,
            name: staff.name,
            admin: staff.admin,
            disabled: staff.disabled,
          };
    });
  }, [staff]);

  useEffect(() => {
    if (error)
      alert(
        Object.keys(error)
          .map((field) => `${field}: ${error[field]}`)
          .join('\n')
      );
  }, [error]);

  const { board_id, name, admin, disabled } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCheckChange = (field) => setFormData({ ...formData, [field]: !formData[field] });

  const boardsToSelectOptions = (boards) =>
    boards.map((board) => {
      const option = {
        value: board.board_id,
        text: `/${board.uri}/ - ${board.name}`,
      };
      return option;
    });

  let elements = [
    {
      component: 'text',
      name: 'name',
      value: name,
      label: 'Nombre',
      onChange: (e) => onChange(e),
    },
  ];

  if (loggedStaff.admin && loggedStaff.staff_id !== staff_id)
    elements = [
      ...elements,
      {
        component: 'select',
        name: 'board_id',
        value: board_id,
        options: !boards
          ? [{ value: 0, text: 'Boards' }]
          : [{ value: 0, text: 'Boards' }, ...boardsToSelectOptions(boards)],
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
      text: 'Editar Staff',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '') alert('El campo "Nombre" es obligatorio');
    else {
      let editedStaff = { ...formData };

      if (admin || board_id === 0) editedStaff.board_id = null;

      editStaff(editedStaff, history);
    }
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Editar Staff</h2>
        {staff_id === loggedStaff.staff_id && (
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

EditStaff.propTypes = {
  editStaff: PropTypes.func.isRequired,
  staffs: PropTypes.object.isRequired,
  boards: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  staffs: state.staffs,
  boards: state.boards,
  auth: state.auth,
});

export default connect(mapStateToProps, { editStaff })(withRouter(EditStaff));
