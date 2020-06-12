import React, { Fragment } from 'react';

import Logo from './Logo';
import BoardsList from './BoardsList';
import LatestThreads from './LatestThreads';

const Home = () => {
  return (
    <Fragment>
      <Logo />
      <div className='container centered'>
        <div className='columns'>
          <BoardsList />
          <LatestThreads />
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
