import React, { Fragment } from 'react';

import prettyBytes from '../../../../utils/prettyBytes';

export default ({ file }) => {
  return (
    <Fragment>
      <p className='file-info'>
        <span className='small'>
          {' '}
          File: {file.name + '.' + file.contentType.split('/')[1]} ({prettyBytes(file.size)})
        </span>
      </p>
      <img className='post-image' src={file.uri.replace('data/image', '/src')} alt='post' />
    </Fragment>
  );
};
