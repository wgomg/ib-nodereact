import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '../../common';

import { createReport } from '../../../actions/reports';
import { useState } from 'react';

const ReportForm = ({ formData, setFormData, rules: { rules }, threads: { thread }, createReport }) => {
  const { report } = formData;
  const { rule_id, post_id } = report;

  const [postUser, setPostUser] = useState(true);

  useEffect(() => {
    if (thread)
      setPostUser(thread.posts.filter((post) => post.post_id === post_id && post.user).length > 0);
  }, [thread, post_id]);

  let rulesOptions = (postUser ? rules : rules.filter((rule) => rule.apply_on === 'file')).map(
    (rule) => ({
      value: rule.rule_id,
      text: rule.text,
      checked: rule.rule_id === rule_id,
    })
  );

  const onChange = (e) => {
    setFormData({ ...formData, report: { ...report, rule_id: e.target.value } });
  };

  const onReportSubmit = (e) => {
    e.preventDefault();

    if (rule_id === 0) alert('Selecciona una regla');
    else {
      const res = createReport(report);

      if (res) alert('Reporte enviado');
      else alert('Ocurrió un error, inténtalo de nuevo');
    }
  };

  const elements = [
    {
      component: 'radio',
      name: 'rule_id',
      options: [{ value: '0', text: 'Ninguno...', checked: rule_id === '0' }, ...rulesOptions],
      onChange: (e) => onChange(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Reportar',
    },
  ];

  return <Form onSubmit={onReportSubmit} elements={elements} isFloatin={true} />;
};

ReportForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  rules: PropTypes.object.isRequired,
  threads: PropTypes.object.isRequired,
  createReport: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  rules: state.rules,
  threads: state.threads,
});

export default connect(mapStateToProps, { createReport })(ReportForm);
