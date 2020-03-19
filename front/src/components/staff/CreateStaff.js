import React, { useState, Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStaff } from '../../actions/staffs';
import { getBoardsList } from '../../actions/boards';

import { Form } from '../common';

const CreateStaff = ({ createStaff, getBoardsList, history, boards: { boards, loading } }) => {
  const [formData, setFormData] = useState({
    board_id: 0,
    name: '',
    admin: 0,
    disabled: 0
  });

  useEffect(() => {
    getBoardsList();
  }, [getBoardsList]);

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
        !boards || loading
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
      text: 'Nuevo Staff'
    }
  ];

  const onSubmit = e => {
    e.preventDefault();

    if (name === '') alert('El campo "Nombre" es obligatorio');
    else {
      let newStaff = { ...formData };

      if (board_id === 0 || admin) delete newStaff.board_id;

      createStaff(newStaff, history);
    }
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Nuevo Staff</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

CreateStaff.propTypes = {
  createStaff: PropTypes.func.isRequired,
  getBoardsList: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boards: state.boards
});

export default connect(mapStateToProps, { createStaff, getBoardsList })(withRouter(CreateStaff));
