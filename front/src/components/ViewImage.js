import React from 'react';

import { Image } from './common';

export default ({ match }) => {
  return <Image className='viewimage' src={'/src/' + match.params.type + '/' + match.params.img} />;
};
