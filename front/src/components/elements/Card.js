import React from 'react';

export default ({ title, content, classes }) => (
  <div className={`card card-centered ${classes}`}>
    <div className='card-header'>
      <h4>{title}</h4>
    </div>
    <div className='container'>
      <div className='columns'>{content}</div>
    </div>
  </div>
);
