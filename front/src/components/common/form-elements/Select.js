import React, { Fragment } from 'react';

export default ({ name, value, options, onChange, lead, label }) => (
  <Fragment>
    <div className='columns'>
      <div className='col-1'>{label && <h4>{label}</h4>}</div>
      <div className='col-4'>
        <select name={name} value={value} onChange={onChange}>
          {options.map(option => (
            <option value={option.value} key={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      {lead && <small className='form-text'>{lead}</small>}
    </div>
  </Fragment>
);
