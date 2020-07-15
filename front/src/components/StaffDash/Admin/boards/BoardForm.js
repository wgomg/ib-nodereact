import React, { useState, Fragment, useEffect } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createBoard, editBoard } from '../../../../actions/boards';

import { Form } from '../../../common';

import alertError from '../../../../utils/alertError';

const BoardForm = ({ boards: { boards, error }, editBoard, createBoard, mode }) => {
  let history = useHistory();
  let { board_uri } = useParams();
  if (mode === 'create') board_uri = null;

  const board = board_uri ? boards.filter((board) => board.uri === board_uri)[0] : null;

  const [formData, setFormData] = useState({
    board_id: '',
    name: '',
    uri: '',
    description: '',
  });

  useEffect(() => {
    setFormData((formData) => {
      return !board
        ? formData
        : { board_id: board.board_id, name: board.name, uri: board.uri, description: board.description };
    });
  }, [board]);

  useEffect(() => {
    alertError(error);
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
      text: (mode === 'edit' ? 'Editar' : 'Nuevo') + ' Board',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '' || uri === '' || description === '') alert('Todos los campos son obligatorios');
    else {
      if (mode === 'edit') editBoard(formData, history);
      else {
        delete formData.board_id;
        createBoard(formData, history);
      }
    }
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>{mode === 'edit' ? 'Editar' : 'Nuevo'} Board</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

BoardForm.propTypes = {
  createBoard: PropTypes.func.isRequired,
  editBoard: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
});

export default connect(mapStateToProps, { createBoard, editBoard })(withRouter(BoardForm));
