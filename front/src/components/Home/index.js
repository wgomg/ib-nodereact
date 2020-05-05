import React, { Fragment } from 'react';

import Logo from './Logo';
import BoardsList from './BoardsList';
import LatestThreads from './LatestThreads';
// import Statistics from './Statistics';

import Footer from '../common/Footer';

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
      {/* <Statistics /> */}
      <Footer />
    </Fragment>
  );
};

export default Home;
