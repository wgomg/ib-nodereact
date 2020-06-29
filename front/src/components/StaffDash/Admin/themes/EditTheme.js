import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { editTheme, getTheme } from '../../../../actions/themes';

import { Form } from '../../../common';

const EditTheme = ({ editTheme, themes: { theme, error, loading } }) => {
  let history = useHistory();

  let { name } = useParams();

  const [formData, setFormData] = useState({
    name: name,
    css: '',
  });

  useEffect(() => {
    getTheme(name);
  }, [name]);

  useEffect(() => {
    setFormData((formData) => {
      return !theme || loading
        ? formData
        : {
            theme_id: theme.theme_id,
            name: theme.name,
            css: theme.css,
          };
    });
  }, [theme, loading]);

  useEffect(() => {
    if (error)
      alert(
        Object.keys(error)
          .map((field) => `${field}: ${error[field]}`)
          .join('\n')
      );
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
      text: 'Editar Tema',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '' || css === '') alert('Hay campos requeridos sin llenar');
    else {
      let updatedTheme = { ...formData };

      editTheme(updatedTheme, history);
    }
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Editar Tema</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

EditTheme.propTypes = {
  editTheme: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  themes: state.themes,
});

export default connect(mapStateToProps, { editTheme })(withRouter(EditTheme));
