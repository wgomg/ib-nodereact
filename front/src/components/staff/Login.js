import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Form } from '../common';

import { login } from '../../actions/auth';

const Login = ({ login, auth: { logged } }) => {
  const [formData, setFormData] = useState({ name: '', password: '' });

  const { name, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    login({ name, password });
  };

  if (logged) return <Redirect to='/staff/dash' />;

  const formElements = [
    {
      component: 'text',
      name: 'name',
      value: name,
      label: 'Nombre',
      onChange: e => onChange(e)
    },
    {
      component: 'text',
      name: 'password',
      value: password,
      label: 'Password',
      onChange: e => onChange(e)
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Ingresar'
    }
  ];

  return (
    <div className='container centered'>
      <Form onSubmit={onSubmit} elements={formElements} />
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { login })(Login);
