import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import { Image } from '.';

const PostFile = ({ post }) => {
  const [hide, setHide] = useState(true);

  let postFile = <div />;

  if (post.file)
    postFile = (
      <Fragment>
        <Image
          className='post-image'
          src={'/' + post.file.thumb}
          hide={!hide}
          onClick={post.file.extension !== 'pdf' ? () => setHide(!hide) : () => null}
        />

        {post.file.extension !== 'pdf' && (
          <Image
            className='post-image'
            src={'/' + post.file.folder + '/' + post.file.name + '.' + post.file.extension}
            hide={hide}
            onClick={() => setHide(!hide)}
          />
        )}
      </Fragment>
    );

  return postFile;
};

PostFile.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostFile;
