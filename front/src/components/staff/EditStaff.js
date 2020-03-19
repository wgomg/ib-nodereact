import React, { useState, Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { editStaff, getStaff } from '../../actions/staffs';
import { getBoardsList } from '../../actions/boards';

import { Form } from '../common';

const EditStaff = ({
  staffs: { staff, loading: staffLoading },
  boards: { boards, loading: boardsLoading },
  editStaff,
  getStaff,
  getBoardsList,
  history,
  match
}) => {
  const [formData, setFormData] = useState({
    staff_id: '',
    board_id: 0,
    name: '',
    admin: 0,
    disabled: 0
  });

  useEffect(() => {
    getStaff(match.params.staff_id);
  }, [getStaff, match.params.staff_id]);

  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

  useEffect(() => {
    setFormData(formData => {
      return !staff || staffLoading
        ? formData
        : {
            staff_id: staff.staff_id,
            board_id: staff.Boards.board_id ? staff.Boards.board_id : 0,
            name: staff.name,
            admin: staff.admin,
            disabled: staff.disabled
          };
    });
  }, [staff, staffLoading]);

  const { board_id, name, admin, disabled } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCheckChange = field => setFormData({ ...formData, [field]: !formData[field] });

  const boardsToSelectOptions = boards =>
    boards.map(board => {
      const option = {
        value: board.board_id,
        text: `/${board.uri}/ - ${board.name}`
      };
      return option;
    });

  const elements = [
    {
      component: 'text',
      name: 'name',
      value: name,
      label: 'Nombre',
      onChange: e => onChange(e)
    },
    {
      component: 'select',
      name: 'board_id',
      value: board_id,
      options:
        !boards || boardsLoading
          ? [{ value: 0, text: 'Boards' }]
          : [{ value: 0, text: 'Boards' }, ...boardsToSelectOptions(boards)],
      label: 'Board',
      onChange: e => onChange(e)
    },
    {
      component: 'check',
      name: 'admin',
      value: admin,
      label: 'Admin ¿?',
      onChange: e => onCheckChange('admin')
    },
    {
      component: 'check',
      name: 'disabled',
      value: !disabled,
      label: 'Habilitado ¿?',
      onChange: e => onCheckChange('disabled')
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Editar Staff'
    }
  ];

  const onSubmit = e => {
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
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

EditStaff.propTypes = {
  editStaff: PropTypes.func.isRequired,
  getStaff: PropTypes.func.isRequired,
  getBoardsList: PropTypes.func.isRequired,
  staffs: PropTypes.object.isRequired,
  boards: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boards: state.boards,
  staffs: state.staffs
});

export default connect(mapStateToProps, { editStaff, getStaff, getBoardsList })(withRouter(EditStaff));