import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';

import { useLocation } from 'react-router-dom';

import { Form } from '../../common';

import { createPost } from '../../../actions/threads';

const NewPostForm = ({ formData, setFormData, isFloatin, createPost }) => {
  let history = useHistory();
  
  const location = useLocation();
  const boardUri = location.pathname.split('/')[1];

  const { newPost } = formData;
  const { thread_id, text, name, image, file_url } = newPost;

  const onChange = (e) =>
    setFormData({
      ...formData,
      newPost: {
        ...newPost,
        [e.target.name]: e.target.name === 'image' ? e.target.files[0] : e.target.value,
      },
    });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (text === '') alert('El campo "Texto" es obligatorio');
    else {
      const newPostFormData = new FormData();

      newPostFormData.set('thread_id', thread_id);
      newPostFormData.set('text', text);
      newPostFormData.set('name', name);
      if (image) newPostFormData.append('image', image);
      newPostFormData.set('file_url', file_url);

      const res = await createPost(newPostFormData);

      if (res) {
        setFormData({
          ...formData,
          newPost: { thread_id: 0, text: '', name: 'Anon', file_url: '', image: null },
        });

        history.push(`/${boardUri}/t${thread_id}`);

        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    }
  };

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
      onChange: (e) => onChange(e),
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

  const form = <Form onSubmit={onSubmit} elements={elements} isFloatin={isFloatin} />;

  const newPostForm = isFloatin ? form : <div className='container centered'>{form}</div>;

  return newPostForm;
};

NewPostForm.defaultProps = {
  isFloatin: false,
};

NewPostForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  isFloatin: PropTypes.bool.isRequired,
  createPost: PropTypes.func.isRequired,
};

export default connect(null, { createPost })(withRouter(NewPostForm));
