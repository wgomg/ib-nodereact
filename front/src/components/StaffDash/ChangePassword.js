import React, { useState, Fragment, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getStaff, changePassword } from '../../actions/staffs';

import { Form } from '../common';

const ChangePassword = ({ staffs: { staff, error, loading }, getStaff, changePassword, match }) => {
  let history = useHistory();

  const [formData, setFormData] = useState({
    staff_id: '',
    name: '',
    password: '',
    password2: '',
  });

  useEffect(() => {
    getStaff(match.params.staff_id);
  }, [getStaff, match.params.staff_id]);

  useEffect(() => {
    setFormData((formData) => {
      return !staff || loading ? formData : { ...formData, staff_id: staff.staff_id, name: staff.name };
    });
  }, [staff, loading]);

  useEffect(() => {
    if (error)
      alert(
        Object.keys(error)
          .map((field) => `${field}: ${error[field]}`)
          .join('\n')
      );
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
  getStaff: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  staffs: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  staffs: state.staffs,
});

export default connect(mapStateToProps, { getStaff, changePassword })(withRouter(ChangePassword));
