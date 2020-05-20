import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Card, Loading } from '../common';

import { getLatestThreads } from '../../actions/threads';
import { getBoardsList } from '../../actions/boards';

import timeSince from '../../utils/timeSince';

import ReactTooltip from 'react-tooltip';

const LatestThreads = ({
  getLatestThreads,
  getBoardsList,
  threads: { latests, loading: latestLoading },
  boards: { boards, loading: boardsLoading },
}) => {
  useEffect(() => {
    getLatestThreads();
    getBoardsList();
  }, [getLatestThreads, getBoardsList]);

  const latestThreads =
    latests.length > 0 ? (
      latests.map((thread) => {
        const board = boards.filter((board) => board.board_id === thread.board_id);

        const postText = thread.post.text.text.map((elem, index) => {
          if (/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/g.test(elem))
            return (
              <div
                style={{ display: 'inline-grid' }}
                dangerouslySetInnerHTML={{ __html: elem }}
                key={index}
              />
            );

          return elem;
        });

        return (
          <div className='columns' key={thread.thread_id}>
            <div className='col-2'>
              <Link
                to={{
                  pathname: `/${board[0].uri}/t${thread.thread_id}`,
                  hash: `#p${thread.post.post_id}`,
                }}
              >
                {`>>/${board[0].uri}/${thread.post.post_id}`}
              </Link>
            </div>
            <div className='col' data-tip data-for={'bmp' + thread.post.post_id}>
              {' '}
              {thread.subject}
            </div>
            <div className='col-2'>{timeSince(thread.post.created_on)}</div>
            <ReactTooltip
              className='tooltip'
              id={'bmp' + thread.post.post_id}
              place='left'
              type='dark'
              effect='solid'
              border={true}
              borderColor='#7da3b3'
            >
              <div className='post-text'>{postText}</div>
            </ReactTooltip>
          </div>
        );
      })
    ) : (
      <h4 className='centered'>No hay threads para mostrar</h4>
    );

  const cardContent = boardsLoading || latestLoading ? <Loading /> : latestThreads;

  return <Card title='Últimos Bumpeos' content={cardContent} classes='col' />;
};

LatestThreads.propTypes = {
  getLatestThreads: PropTypes.func.isRequired,
  getBoardsList: PropTypes.func.isRequired,
  threads: PropTypes.object.isRequired,
  boards: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  threads: state.threads,
  boards: state.boards,
});

export default connect(mapStateToProps, { getLatestThreads, getBoardsList })(LatestThreads);
