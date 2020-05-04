import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card, Loading, PostLink } from '../common';

import { getLatestPosts } from '../../actions/posts';
import { getBoardsList } from '../../actions/boards';

const LatestPosts = ({
  getLatestPosts,
  getBoardsList,
  posts: { latests, loading: latestLoading },
  boards: { boards, loading: boardsLoading },
}) => {
  useEffect(() => {
    getLatestPosts();
    getBoardsList();
  }, [getLatestPosts, getBoardsList]);

  const latestPosts =
    latests.length > 0 ? (
      latests.map((post) => {
        const board = boards.filter((board) => board.board_id === post.board_id);

        return (
          <div className='columns' key={post.post_id}>
            <div className='col-3'>
              <PostLink board={board[0]} post={post} fullLink />
            </div>
            <div className='col'>{post.text}</div>
          </div>
        );
      })
    ) : (
      <h4 className='centered'>No hay Posts para mostrar</h4>
    );

  const cardContent = boardsLoading || latestLoading ? <Loading /> : latestPosts;

  return <Card title='Últimas Respuestas' content={cardContent} classes='col' />;
};

LatestPosts.propTypes = {
  getLatestPosts: PropTypes.func.isRequired,
  getBoardsList: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired,
  boards: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  boards: state.boards,
});

export default connect(mapStateToProps, { getLatestPosts, getBoardsList })(LatestPosts);
