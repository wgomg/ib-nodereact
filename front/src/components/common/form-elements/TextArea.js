import React, { Fragment } from 'react';

export default ({ name, value, onChange, label, lead }) => (
  <Fragment>
    <div className='columns'>
      <div className='col-2'>{label && <h4>{label}</h4>}</div>
      <div className='col-8'>
        <textarea name={name} value={value} onChange={onChange}></textarea>
      </div>
      <small className='form-text'>{lead}</small>
    </div>
  </Fragment>
);
