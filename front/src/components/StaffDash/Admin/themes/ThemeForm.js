import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { editTheme, createTheme } from '../../../../actions/themes';

import { Form } from '../../../common';

import alertError from '../../../../utils/alertError';

const ThemeForm = ({ themes: { themes, error }, createTheme, editTheme, mode }) => {
  let history = useHistory();
  let { name } = useParams();
  if (mode === 'create') name = null;

  const theme = name ? themes.filter((theme) => theme.name === name)[0] : null;

  const [formData, setFormData] = useState({
    theme_id: '0',
    name: '',
    css: '',
  });

  useEffect(() => {
    setFormData((formData) =>
      !theme ? formData : { theme_id: theme.theme_id, name: theme.name, css: theme.css }
    );
  }, [theme]);

  useEffect(() => {
    alertError(error);
  }, [error]);

  const { css } = formData;

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
      text: (mode === 'edit' ? 'Editar' : 'Nuevo') + ' Tema',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '' || css === '') alert('Hay campos requeridos sin llenar');
    else {
      if (mode === 'edit') editTheme(formData, history);
      else {
        delete formData.theme_id;
        createTheme(formData, history);
      }
    }
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>{mode === 'edit' ? 'Editar' : 'Nuevo'} Tema</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

ThemeForm.propTypes = {
  createTheme: PropTypes.func.isRequired,
  editTheme: PropTypes.func.isRequired,
  themes: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  themes: state.themes,
});

export default connect(mapStateToProps, { createTheme, editTheme })(withRouter(ThemeForm));
