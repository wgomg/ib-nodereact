import React, { Fragment } from 'react';

export default ({ props: { type, onClick, text }, lead }) => (
  <Fragment>
    <button onClick={onClick} type={type} className='btn'>
      {text}
    </button>
    <span>{lead}</span>
  </Fragment>
);
