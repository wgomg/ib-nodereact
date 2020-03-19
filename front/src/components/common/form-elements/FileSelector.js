import React, { Fragment } from 'react';

export default ({ name, onChange, lead, label }) => (
  <Fragment>
    <div className='columns'>
      <div className='col-2'>{label && <h4>{label}</h4>}</div>
      <div className='col-8'>
        <input type='file' name={name} onChange={onChange} />
      </div>
    </div>
    {lead && <small className='form-text'>{lead}</small>}
  </Fragment>
);
