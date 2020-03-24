import React from 'react';
import logo from './logo.png';

import { Image } from '../common';

export default () => (
  <div className='container centered'>
    <Image className='logo centered' src={logo} />
    <p className='centered'>Lorem ipsum dolor sit amet</p>
  </div>
);
