import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Post from './Post';
import OpPost from './OpPost';

export default ({ threads, board }) => {
  const [page, setPage] = useState(0);
  const [btnVisited, setBtnVisited] = useState([]);

  const topThread = useRef(null);

  let threadsList = (
    <Fragment>
      <hr className='separator' />
      <h2 className='centered warning'>No hay Hilos para mostrar</h2>
      <hr className='separator' />
    </Fragment>
  );

  let pages = [];
  let pagesNum = 0;

  if (threads && threads.length > 0) {
    let hilos = [...threads];
    let threadsPages = [];

    while (hilos.length > 0)
      threadsPages.push(
        hilos.splice(0, 10).map((thread, index) => {
          let postsList =
            thread.posts.length > 1
              ? thread.posts
                  .slice(Math.max(thread.posts.length - 5, 1))
                  .map((post) => <Post thread={thread} board={board} post={post} key={post.post_id} />)
              : '';

          const hiddenPosts = thread.posts.length - 6;
          let props = { thread: thread, post: thread.posts[0], isThread: false };
          if (hiddenPosts > 0) props.hiddenPosts = hiddenPosts;

          const opPost = <OpPost {...props} />;

          let divProps = {
            className: 'container thread-preview',
            key: thread.thread_id,
          };

          if (index === 0) divProps.ref = topThread;

          return (
            <div {...divProps}>
              {opPost}
              {postsList}
            </div>
          );
        })
      );

    pages = threadsPages.map((list, index) => (
      <Fragment key={index}>
        <button
          className={'link' + (btnVisited[index] ? ' visited' : '')}
          onClick={() => onClick(index, topThread)}
        >
          {index + 1}
        </button>
        {index !== threadsPages.length - 1 ? ' / ' : ''}
      </Fragment>
    ));

    pagesNum = pages.length;

    threadsList = threadsPages[page];
  }

  useEffect(() => {
    setBtnVisited(new Array(pagesNum).fill(false));
  }, [pagesNum]);

  const onClick = (page, topThread) => {
    setBtnVisited(btnVisited.map((btn, index) => index === page));
    setPage(page);

    window.scrollTo(0, topThread.current.offsetTop);
  };

  return (
    <Fragment>
      {threadsList}
      {pages.length > 0 && (
        <div className='container centered pages'>
          <hr className='separator' />
          <p className='centered'>
            [ {pages} ] [ <Link to='/'>Home</Link> ]{' '}
          </p>
        </div>
      )}
    </Fragment>
  );
};
