import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card, Loading, PostLink } from './elements';

import { getLatestPosts } from '../actions/posts';
import { getBoardsList } from '../actions/boards';

const LatestPosts = ({
  getLatestPosts,
  getBoardsList,
  posts: { latests, loading: latestLoading },
  boards: { boards, loading: boardsLoading }
}) => {
  useEffect(() => {
    getLatestPosts();
    getBoardsList();
  }, [getLatestPosts, getBoardsList]);

  const latestPosts =
    latests.length > 0 ? (
      <ul className='no-style col'>
        {latests.map(post => {
          const board = boards.filter(board => board.board_id === post.Threads.board_id);

          return (
            <li key={post.post_id}>
              <PostLink board={board[0]} post={post} fullLink /> - {post.text}
            </li>
          );
        })}
      </ul>
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
  boards: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  posts: state.posts,
  boards: state.boards
});

export default connect(mapStateToProps, { getLatestPosts, getBoardsList })(LatestPosts);
