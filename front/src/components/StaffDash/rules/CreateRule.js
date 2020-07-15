import React, { useState, useEffect, Fragment } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createRule } from '../../../actions/rules';

import { Form } from '../../common';

import alertError from '../../../utils/alertError';

const CreateRule = ({ createRule, board_id, rules: { error } }) => {
  let history = useHistory();

  const [formData, setFormData] = useState({
    board_id: null,
    text: '',
    ban_duration: '',
    apply_on: 'post',
    details: '',
  });

  useEffect(() => {
    setFormData((formData) => {
      return !board_id ? formData : { ...formData, board_id };
    });
  }, [board_id]);

  useEffect(() => {
    alertError(error);
  }, [error]);

  const { text, ban_duration, apply_on } = formData;

  const applyOnOptions = [
    {
      value: 'post',
      text: 'Post',
      checked: 'post' === apply_on,
    },
    {
      value: 'file',
      text: 'Archivo',
      checked: 'file' === apply_on,
    },
  ];

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
      name: 'ban_duration',
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
      component: 'radio',
      name: 'apply_on',
      options: applyOnOptions,
      label: 'Aplicar en',
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

    if (text === '' || ban_duration === '') alert('Todos los campos son obligatorios');
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
  rules: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  rules: state.rules,
});

export default connect(mapStateToProps, { createRule })(withRouter(CreateRule));
