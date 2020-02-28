import React, { Fragment } from 'react';

export default ({ props: { name, value, customOnChange, text, checked }, onChange, lead, label }) => (
  <Fragment>
    {label && <h4>{label}</h4>}
    <p>
      <input
        type='checkbox'
        name={name}
        value={value}
        checked={checked}
        onChange={customOnChange || onChange}
      />{' '}
      {text}
    </p>
    {lead && <small className='form-text'>{lead}</small>}
  </Fragment>
);
