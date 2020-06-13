import React from 'react';
import PropTypes from 'prop-types';

import { Form } from '../../common';

const ReportForm = ({ formData, onChange, onSubmit, rules }) => {
  const { rule_id } = formData;

  const rulesToSelectOptions = (rules) =>
    rules.map((rule) => {
      return { value: rule.rule_id, text: rule.text };
    });

  const elements = [
    {
      component: 'radio',
      name: 'rule_id',
      value: rule_id,
      options: [{ value: '0', text: 'Ninguno...' }, ...rulesToSelectOptions(rules)],
      label: 'Regla',
      onChange: (e) => onChange(e),
    },
    {
      component: 'btn',
      type: 'submit',
      text: 'Reportar',
    },
  ];

  return <Form onSubmit={onSubmit} elements={elements} isFloatin={true} />;
};

ReportForm.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  rules: PropTypes.array.isRequired,
};

export default ReportForm;
