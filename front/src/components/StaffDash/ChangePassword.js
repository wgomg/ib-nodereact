import React, { useState, Fragment, useEffect } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { changePassword } from '../../actions/staffs';

import { Form } from '../common';

import alertError from '../../utils/alertError';

const ChangePassword = ({ staffs: { staffs, error }, auth: { staff: loggedStaff }, changePassword }) => {
  let history = useHistory();

  let { staff_id } = useParams();

  let staff = staffs.filter((s) => s.staff_id === staff_id)[0];

  if (!loggedStaff.admin) staff = loggedStaff;

  const [formData, setFormData] = useState({
    staff_id: '',
    name: '',
    password: '',
    password2: '',
  });

  useEffect(() => {
    setFormData((formData) => {
      return !staff ? formData : { ...formData, staff_id: staff.staff_id, name: staff.name };
    });
  }, [staff]);

  useEffect(() => {
    alertError(error);
  }, [error]);

  const { password, password2 } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const elements = [
    {
      component: 'text',
      name: 'password',
      value: password,
      label: 'Contraseña',
      onChange: (e) => onChange(e),
    },
    {
      component: 'text',
      name: 'password2',
      value: password2,
      label: 'Contraseña (r)',
      onChange: (e) => onChange(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Cambiar Contraseña',
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();

    if (password === '' || password2 === '') return alert('Ambos campos son obligatorios');

    if (password !== password2) return alert('Las contraseñas no coinciden');

    let editedStaff = { ...formData };
    delete editedStaff.password2;

    changePassword(editedStaff, history);
  };

  return (
    <Fragment>
      <div className='container centered'>
        <h2 className='centered title'>Cambiar Contraseña</h2>
      </div>
      <div className='container centered'>
        <Form onSubmit={onSubmit} elements={elements} />
      </div>
    </Fragment>
  );
};

ChangePassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
  staffs: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  staffs: state.staffs,
  auth: state.auth,
});

export default connect(mapStateToProps, { changePassword })(withRouter(ChangePassword));
