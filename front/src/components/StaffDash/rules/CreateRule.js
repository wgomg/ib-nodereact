import React, { useState, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createRule } from '../../../actions/rules';

import { Form } from '../../common';

const CreateRule = ({ createRule, history, board_id }) => {
  const [formData, setFormData] = useState({
    board_id: null,
    text: '',
    duration: '',
    details: '',
  });

  useEffect(() => {
    setFormData((formData) => {
      return !board_id ? formData : { ...formData, board_id };
    });
  }, [board_id]);

  const { text, duration } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const elements = [
    {
      component: 'text',
      name: 'text',
      label: 'Texto',
      onChange: (e) => onChange(e),
    },
    {
      component: 'text',
      name: 'duration',
      label: 'Duración',
      onChange: (e) => onChange(e),
    },
    {
      component: 'text',
      name: 'details',
      label: 'Detalles',
      onChange: (e) => onChange(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Nueva Regla',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (text === '' || duration === '') alert('Todos los campos son obligatorios');
    else createRule(formData, history);
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Nueva Regla</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

CreateRule.propTypes = {
  createRule: PropTypes.func.isRequired,
  board_id: PropTypes.number,
};

export default connect(null, { createRule })(withRouter(CreateRule));
