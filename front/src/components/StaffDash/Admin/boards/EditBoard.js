import React, { useState, Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { editBoard, getBoard } from '../../../../actions/boards';

import { Form } from '../../../common';

const EditBoard = ({ boards: { board, error, loading }, editBoard, getBoard, history, match }) => {
  const [formData, setFormData] = useState({
    board_id: '',
    name: '',
    uri: '',
    description: '',
  });

  useEffect(() => {
    getBoard(match.params.board_uri);
  }, [getBoard, match.params.board_uri]);

  useEffect(() => {
    setFormData((formData) => {
      return !board || loading
        ? formData
        : { board_id: board.board_id, name: board.name, uri: board.uri, description: board.description };
    });
  }, [board, loading]);

  useEffect(() => {
    if (error)
      alert(
        Object.keys(error)
          .map((field) => `${field}: ${error[field]}`)
          .join('\n')
      );
  }, [error]);

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
      text: 'Editar Board',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '' || uri === '' || description === '') alert('Todos los campos son obligatorios');
    else editBoard(formData, history);
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Editar Board</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

EditBoard.propTypes = {
  editBoard: PropTypes.func.isRequired,
  getBoard: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
});

export default connect(mapStateToProps, { editBoard, getBoard })(withRouter(EditBoard));
