import React, { useState, Fragment, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createBoard } from '../../../../actions/boards';

import { Form } from '../../../common';

const CreateBoard = ({ createBoard, boards: { error } }) => {
  let history = useHistory();

  const [formData, setFormData] = useState({
    name: '',
    uri: '',
    description: '',
  });

  const { name, uri, description } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (error)
      alert(
        Object.keys(error)
          .map((field) => `${field}: ${error[field]}`)
          .join('\n')
      );
  }, [error]);

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

const mapStateToProps = (state) => ({
  boards: state.boards,
});

export default connect(mapStateToProps, { createBoard })(withRouter(CreateBoard));
