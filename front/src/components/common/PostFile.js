import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import { Image, Player } from '.';

const PostFile = ({ post }) => {
  const [hide, setHide] = useState(true);

  let postFile = <div />;

  if (post.file) {
    if (!isVideo(post.file.mimetype))
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
    else
      postFile = (
        <div style={{ display: 'block', float: 'left' }}>
          <Player post={post} />
        </div>
      );
  }

  return postFile;
};

const isVideo = (mimetype) =>
  mimetype.includes('video/mp4') || mimetype.includes('video/m4v') || mimetype.includes('video/webm');

PostFile.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostFile;
