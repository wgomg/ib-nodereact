import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ButtonLink } from '../common';

import { getFileBlob } from '../../actions/files';

import prettyBytes from '../../utils/prettyBytes';

const FileDownload = ({ post, getFileBlob, files }) => {
  const [blobFile, setBlobFile] = useState(null);
  const [fileId, setFileId] = useState('');

  useEffect(() => {
    const { loading, blob, file } = files;

    if (!loading && blob && file && file.file_id === fileId) setBlobFile({ blob, file });
  }, [files, setBlobFile, fileId]);

  useEffect(() => {
    if (blobFile) {
      const { file, blob } = blobFile;

      if (file && blob) {
        const postFile = new Blob([new Uint8Array(blob.data)], { type: file.mimetype });
        const postFileUrl = URL.createObjectURL(postFile);

        const link = document.createElement('a');
        link.href = postFileUrl;
        link.download = file.name + '.' + file.extension;

        document.body.appendChild(link);

        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setFileId('');
        setBlobFile(null);

        document.body.removeChild(link);
      }
    }
  }, [blobFile]);

  const downloadFile = (postFileId) => {
    getFileBlob(postFileId);
    setFileId(postFileId);
  };

  return (
    <span className='small'>
      {' '}
      {post.file && (
        <Fragment>
          <ButtonLink
            text={`File: ${post.file.name}.${post.file.extension} (${prettyBytes(post.file.size)})`}
            onClick={() => downloadFile(post.file.file_id)}
          />
        </Fragment>
      )}
    </span>
  );
};

FileDownload.propTypes = {
  post: PropTypes.object.isRequired,
  getFileBlob: PropTypes.func.isRequired,
  files: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  files: state.files,
});

export default connect(mapStateToProps, { getFileBlob })(FileDownload);
