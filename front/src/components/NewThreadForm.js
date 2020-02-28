import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createThread } from '../actions/threads';

import { Form } from './elements';

const NewThreadForm = ({ board, createThread, threads: { thread, loading } }) => {
  const [formData, setFormData] = useState({
    board_id: board.board_id,
    subject: '',
    text: '',
    name: '',
    image: ''
  });

  const { subject, text, name, image } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createThread(formData);
  };

  return (
    <div className='container centered'>
      <Form
        onSubmit={onSubmit}
        onChange={e => onChange(e)}
        elements={[
          {
            component: 'text',
            props: {
              name: 'name',
              value: name
            },
            label: 'Nombre'
          },
          {
            component: 'text',
            props: {
              name: 'subject',
              value: subject
            },
            label: 'Tema'
          },
          {
            component: 'textarea',
            props: {
              name: 'text',
              value: text
            },
            label: 'Texto'
          },
          {
            component: 'btn',
            props: {
              type: 'submit',
              text: 'Nuevo Hilo'
            }
          }
        ]}
      />
    </div>
  );
};

NewThreadForm.propTypes = {
  createThread: PropTypes.func.isRequired,
  board: PropTypes.object.isRequired,
  threads: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  threads: state.threads
});

export default connect(mapStateToProps, { createThread })(NewThreadForm);
