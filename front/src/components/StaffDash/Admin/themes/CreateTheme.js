import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createTheme } from '../../../../actions/themes';

import { Form } from '../../../common';

const CreateTheme = ({ createTheme, history, themes: { error } }) => {
  const [formData, setFormData] = useState({
    name: '',
    css: '',
  });

  useEffect(() => {
    if (error)
      alert(
        Object.keys(error)
          .map((field) => `${field}: ${error[field]}`)
          .join('\n')
      );
  }, [error]);

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
  tags: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  themes: state.themes,
});

export default connect(mapStateToProps, { createTheme })(withRouter(CreateTheme));
