import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createTag } from '../../../../actions/tags';

import { Form } from '../../../common';

import alertError from '../../../../utils/alertError';

const CreateTag = ({ createTag, tags: { error } }) => {
  let history = useHistory();

  const [formData, setFormData] = useState({
    tag: '',
    name: '',
    op_replacer: '',
    cl_replacer: '',
    css: '',
  });

  useEffect(() => {
    alertError(error);
  }, [error]);

  const { tag, name, op_replacer, cl_replacer, css } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const elements = [
    {
      component: 'text',
      name: 'tag',
      value: tag,
      label: 'Tag',
      onChange: (e) => onChange(e),
    },
    {
      component: 'text',
      name: 'name',
      value: name,
      label: 'Name',
      onChange: (e) => onChange(e),
    },
    {
      component: 'text',
      name: 'op_replacer',
      value: op_replacer,
      label: 'Prefix',
      onChange: (e) => onChange(e),
    },
    {
      component: 'text',
      name: 'cl_replacer',
      value: cl_replacer,
      label: 'Postfix',
      onChange: (e) => onChange(e),
    },
    {
      component: 'textarea',
      name: 'css',
      value: css,
      label: 'CSS',
      onChange: (e) => onChange(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Nuevo Tag',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (tag === '' || name === '' || op_replacer === '' || cl_replacer === '')
      alert('Hay campos requeridos sin llenar');
    else {
      let newTag = { ...formData };

      createTag(newTag, history);
    }
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Nuevo Tag</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

CreateTag.propTypes = {
  createTag: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tags: state.tags,
});

export default connect(mapStateToProps, { createTag })(withRouter(CreateTag));
