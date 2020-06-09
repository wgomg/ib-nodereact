import React from 'react';
import PropTypes from 'prop-types';

import { Form } from '../../common';

const NewPostForm = ({ formData, onChange, onFileSelected, onSubmit, isFloatin }) => {
  const { text, name, file_url } = formData;

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
      name: 'text',
      value: text,
      label: 'Texto',
      onChange: (e) => onChange(e),
    },
    {
      component: 'file',
      name: 'image',
      label: 'Archivo',
      onChange: (e) => onFileSelected(e),
    },
    {
      component: 'text',
      name: 'file_url',
      value: file_url,
      label: 'URL',
      onChange: (e) => onChange(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Responder',
    },
  ];

  const formProps = { onSubmit, elements, isFloatin };

  const form = <Form {...formProps} />;

  const newPostForm = isFloatin ? form : <div className='container centered'>{form}</div>;

  return newPostForm;
};

NewPostForm.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onFileSelected: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isFloatin: PropTypes.bool,
};

export default NewPostForm;
