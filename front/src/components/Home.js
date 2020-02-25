import React, { Fragment } from 'react';
import BoardsList from './BoardsList';
import Latests from './LatestPosts';
import Statistics from './Statistics';

const Home = () => {
  return (
    <Fragment>
      <div className='container centered'>
        <div className='columns'>
          <BoardsList />
          <Latests />
        </div>
      </div>
      <Statistics />
    </Fragment>
  );
};

export default Home;
