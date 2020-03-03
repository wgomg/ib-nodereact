import React, { Fragment } from 'react';
import { BoardsList, LatestPosts, Statistics } from './home';

const Home = () => {
  return (
    <Fragment>
      <div className='container centered'>
        <div className='columns'>
          <BoardsList />
          <LatestPosts />
        </div>
      </div>
      <Statistics />
    </Fragment>
  );
};

export default Home;
