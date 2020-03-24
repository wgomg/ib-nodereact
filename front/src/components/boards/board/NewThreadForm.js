import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createThread } from '../../../actions/boards';

import { Form } from '../../common';

const NewThreadForm = ({ board, createThread }) => {
  const [formData, setFormData] = useState({
    board_id: board.board_id,
    subject: '',
    text: '',
    name: ''
  });

  const [file, setFile] = useState('');

  const { subject, text, name } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileSelected = e => setFile(e.target.files[0]);

  const elements = [
    {
      component: 'text',
      name: 'name',
      value: name,
      label: 'Nombre',
      onChange: e => onChange(e)
    },
    {
      component: 'text',
      name: 'subject',
      value: subject,
      label: 'Tema',
      onChange: e => onChange(e)
    },
    {
      component: 'textarea',
      name: 'text',
      value: text,
      label: 'Texto',
      onChange: e => onChange(e)
    },
    {
      component: 'file',
      name: 'image',
      label: 'Archivo',
      onChange: e => onFileSelected(e)
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Nuevo Hilo'
    }
  ];

  const onSubmit = e => {
    e.preventDefault();

    const { board_id, subject, text, name } = formData;

    if (subject === '' || text === '') alert('Los campos "Tema", "Texto" y "Archivo" son obligatorios');
    else {
      const newThread = new FormData();

      newThread.set('board_id', board_id);
      newThread.set('subject', subject);
      newThread.set('text', text);
      newThread.set('name', name);
      newThread.append('image', file);

      createThread(newThread);
    }
  };

  return (
    <div className='container centered'>
      <Form onSubmit={onSubmit} elements={elements} />
    </div>
  );
};

NewThreadForm.propTypes = {
  createThread: PropTypes.func.isRequired,
  board: PropTypes.object.isRequired
};

export default connect(null, { createThread })(NewThreadForm);
