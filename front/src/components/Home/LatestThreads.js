import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card, Loading, PostLink } from '../common';

import { getLatestThreads } from '../../actions/threads';
import { getBoardsList } from '../../actions/boards';

import timeSince from '../../utils/timeSince';

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

        return (
          <div className='columns' key={thread.thread_id}>
            <div className='col-2'>
              <PostLink board={board[0]} post={thread.post} fullLink />
            </div>
            <div className='col'>{thread.subject}</div>
            <div className='col-2'>{timeSince(thread.post.created_on)}</div>
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
