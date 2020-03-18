import React, { Fragment } from 'react';

export default ({ name, text, value, onChange, lead, label }) => (
  <Fragment>
    <div className='columns'>
      <div className='col-1'>{label && <h4>{label}</h4>}</div>
      <div className='col-4'>
        <input type='checkbox' name={name} value={value} checked={value} onChange={onChange} /> {text}
      </div>
      {lead && <small className='form-text'>{lead}</small>}
    </div>
  </Fragment>
);
