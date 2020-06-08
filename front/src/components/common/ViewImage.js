import React from 'react';

import Image from './Image';

export default ({ match }) => <Image className='viewimage' src={match.url} />;
