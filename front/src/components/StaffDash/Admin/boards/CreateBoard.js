import React, { useState, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createBoard } from '../../../../actions/boards';

import { Form } from '../../../common';

const CreateBoard = ({ createBoard, history }) => {
  const [formData, setFormData] = useState({
    name: '',
    uri: '',
    description: '',
  });

  const { name, uri, description } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const elements = [
    {
      component: 'text',
      name: 'name',
      value: name,
      label: 'Nombre',
      onChange: (e) => onChange(e),
    },
    {
      component: 'text',
      name: 'uri',
      value: uri,
      label: 'uri',
      onChange: (e) => onChange(e),
    },
    {
      component: 'textarea',
      name: 'description',
      value: description,
      label: 'Descripción',
      onChange: (e) => onChange(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Nuevo Board',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '' || uri === '' || description === '') alert('Todos los campos son obligatorios');
    else createBoard(formData, history);
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Nuevo Board</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

CreateBoard.propTypes = {
  createBoard: PropTypes.func.isRequired,
};

export default connect(null, { createBoard })(withRouter(CreateBoard));
