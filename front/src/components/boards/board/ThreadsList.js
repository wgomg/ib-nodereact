import React, { Fragment } from 'react';

import Post from './posts/Post';

export default ({ board }) => (
  <div className='container'>
    {board.threads &&
      (board.threads.length > 0 ? (
        board.threads.map(thread => {
          const opPost = <Post thread={thread} post={thread.posts[0]} className={''} />;

          return (
            <div className='container thread-preview' key={thread.thread_id}>
              {opPost}
            </div>
          );
        })
      ) : (
        <Fragment>
          <hr className='separator' />
          <h2 className='centered warning'>No hay Hilos para mostrar</h2>
          <hr className='separator' />
        </Fragment>
      ))}
  </div>
);
