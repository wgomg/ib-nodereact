import React from 'react';

import Image from './Image';

export default ({ match }) => {
  return <Image className='viewimage' src={'/data/' + match.params.img} />;
};
