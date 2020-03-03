import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createThread } from '../../actions/boards';

import { Form } from '../common';

const NewThreadForm = ({ board, createThread }) => {
  const [formData, setFormData] = useState({
    board_id: board.board_id,
    subject: '',
    text: '',
    name: '',
    image: ''
  });

  const { subject, text, name, image } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const elements = [
    {
      component: 'text',
      name: 'name',
      value: name,
      label: 'Nombre'
    },
    {
      component: 'text',
      name: 'subject',
      value: subject,
      label: 'Tema'
    },
    {
      component: 'textarea',
      name: 'text',
      value: text,
      label: 'Texto'
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Nuevo Hilo'
    }
  ];

  const onSubmit = e => {
    e.preventDefault();

    const { subject } = formData;

    if (subject === '' || text === '') alert('Los campos "Tema" y "Texto" son obligatorios');
    else createThread(formData);
  };

  return (
    <div className='container centered'>
      <Form onSubmit={onSubmit} onChange={e => onChange(e)} elements={elements} />
    </div>
  );
};

NewThreadForm.propTypes = {
  createThread: PropTypes.func.isRequired,
  board: PropTypes.object.isRequired
};

export default connect(null, { createThread })(NewThreadForm);
