import React, { Fragment } from 'react';

export default ({ type, onClick, text, lead }) => (
  <Fragment>
    <button onClick={onClick} type={type} className='btn'>
      {text}
    </button>
    <span>{lead}</span>
  </Fragment>
);
