import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createPost } from '../../../actions/boards';

import { Form } from '../../common';
import { useEffect } from 'react';

const NewPostForm = ({ thread, createPost }) => {
  const [formData, setFormData] = useState({
    thread_id: 0,
    text: '',
    name: 'Anon',
  });

  useEffect(() => {
    setFormData((formData) => {
      return { ...formData, thread_id: thread.thread_id };
    });
  }, [thread]);

  const [file, setFile] = useState(null);

  const { text, name } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileSelected = (e) => setFile(e.target.files[0]);

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
      component: 'btn',
      type: 'submit',
      text: 'Responder',
    },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();

    const { thread_id, text, name } = formData;

    if (text === '') alert('El campo "Texto" es obligatorio');
    else {
      const newPost = new FormData();

      newPost.set('thread_id', thread_id);
      newPost.set('text', text);
      newPost.set('name', name);
      if (file) newPost.append('image', file);

      const res = await createPost(newPost);
      if (res) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className='container centered'>
      <Form onSubmit={onSubmit} elements={elements} />
    </div>
  );
};

NewPostForm.propTypes = {
  createPost: PropTypes.func.isRequired,
  thread: PropTypes.object.isRequired,
};

export default connect(null, { createPost })(NewPostForm);
