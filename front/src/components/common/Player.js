import React from 'react';
import PropTypes from 'prop-types';

import ReactPlayer from 'react-player/lazy';

const Player = ({ post }) => {
  const isVideoFile = post.file ? isVideo(post.file.mimetype) : false;
  const url = isVideoFile ? `/data/${post.file.name}.${post.file.extension}` : post.file_url;

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
};

export default Player;
