import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Image } from '.';

import { getFileBlob } from '../../actions/files';

import ReactPlayer from 'react-player/lazy';

const PostFile = ({ post, files: { file, blob, loading }, getFileBlob }) => {
  const [hide, setHide] = useState(true);
  const [isVideoFile, setIsVideoFile] = useState(post.file ? isVideo(post.file.mimetype) : false);
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (isVideoFile) {
      getFileBlob(post.file.name);
      setIsVideoFile(false);
    }
  }, [isVideoFile, getFileBlob, post]);

  useEffect(() => {
    if (!loading && blob && file && post.file && file.name === post.file.name) {
      const postFile = new Blob([new Uint8Array(blob.data)], { type: file.mimetype });
      const postFileUrl = URL.createObjectURL(postFile);

      setBlobUrl(postFileUrl);
    }
  }, [loading, file, blob, post]);

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
    else if (blobUrl)
      postFile = (
        <div style={{ display: 'block', float: 'left' }}>
          <ReactPlayer
            url={blobUrl}
            playing={false}
            loop={false}
            controls={true}
            width={426}
            height={240}
          />
        </div>
      );
  }

  return postFile;
};

const isVideo = (mimetype) =>
  mimetype.includes('video/mp4') || mimetype.includes('video/m4v') || mimetype.includes('video/webm');

PostFile.propTypes = {
  post: PropTypes.object.isRequired,
  getFileBlob: PropTypes.func.isRequired,
  files: PropTypes.object,
};

const mapStateToProps = (state) => ({
  files: state.files,
});

export default connect(mapStateToProps, { getFileBlob })(PostFile);
