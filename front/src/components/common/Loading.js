import React, { Fragment } from 'react';
import loading from './loading.gif';

export default () => (
  <Fragment>
    <img className='loading' src={loading} alt='Loading...' />
  </Fragment>
);
