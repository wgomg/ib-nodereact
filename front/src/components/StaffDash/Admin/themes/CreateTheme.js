import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createTheme } from '../../../../actions/themes';

import { Form } from '../../../common';

const CreateTheme = ({ createTheme, history }) => {
  const [formData, setFormData] = useState({
    name: '',
    css: '',
  });

  const { name, css } = formData;

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
      component: 'textarea',
      name: 'css',
      value: css,
      label: 'CSS',
      rows: 20,
      onChange: (e) => onChange(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Nuevo Tema',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '' || css === '') alert('Hay campos requeridos sin llenar');
    else {
      let newTheme = { ...formData };

      createTheme(newTheme, history);
    }
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Nuevo Tema</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

CreateTheme.propTypes = {
  createTheme: PropTypes.func.isRequired,
};

export default connect(null, { createTheme })(withRouter(CreateTheme));
