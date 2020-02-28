import React, { Fragment } from 'react';

export default ({ props: { name, value, options }, onChange, lead }) => (
  <Fragment>
    <select name={name} value={value} onChange={onChange}>
      {options.map(option => (
        <option value={option.value} key={option.value}>
          {option.text}
        </option>
      ))}
    </select>
    <small className='form-text'>{lead}</small>
  </Fragment>
);
