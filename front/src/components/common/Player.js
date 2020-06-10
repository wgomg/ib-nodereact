import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getFileBlob } from '../../actions/files';

import ReactPlayer from 'react-player/lazy';

const Player = ({ post, files: { loading, file, blob }, getFileBlob }) => {
  const [isVideoFile, setIsVideoFile] = useState(post.file ? isVideo(post.file.mimetype) : false);
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (isVideoFile) {
      getFileBlob(post.file.file_id);
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

  const url = post.file_url || blobUrl;

  const thumb = () => {
    if (post.file_url && (post.file_url.includes('dai.ly') || post.file_url.includes('dailymotion'))) {
      const videoId = post.file_url.split('/').pop();

      return `https://www.dailymotion.com/thumbnail/video/${videoId}`;
    }

    if (post.file && !post.file.thumb.includes('not-found') && post.file.mimetype.includes('video'))
      return window.location.origin + '/' + post.file.thumb;

    return true;
  };

  return (
    <div style={{ padding: '1rem' }}>
      <ReactPlayer
        light={thumb()}
        url={url}
        playing={false}
        loop={false}
        controls={true}
        width={426}
        height={240}
      />
    </div>
  );
};

const isVideo = (mimetype) =>
  mimetype.includes('video/mp4') || mimetype.includes('video/m4v') || mimetype.includes('video/webm');

Player.propTypes = {
  post: PropTypes.object.isRequired,
  getFileBlob: PropTypes.func.isRequired,
  files: PropTypes.object,
};

const mapStateToProps = (state) => ({
  files: state.files,
});

export default connect(mapStateToProps, { getFileBlob })(Player);
