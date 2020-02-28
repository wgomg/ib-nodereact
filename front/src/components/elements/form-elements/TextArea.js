import React, { Fragment } from 'react';

export default ({ props: { name, value }, onChange, label, lead }) => (
  <Fragment>
    <div className='columns'>
      <div className='col-1'>{label && <h4>{label}</h4>}</div>
      <div className='col-4'>
        <textarea name={name} value={value} onChange={onChange}></textarea>
      </div>
      <small className='form-text'>{lead}</small>
    </div>
  </Fragment>
);
