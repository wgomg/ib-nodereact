import React from 'react';

export default ({ match }) => (
  <img
    className='viewimage'
    src={'/src/' + match.params.type + '/' + match.params.img}
    alt={'/src/' + match.params.type + '/' + match.params.img}
  />
);
