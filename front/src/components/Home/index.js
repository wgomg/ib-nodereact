import React, { Fragment } from 'react';

import Logo from './Logo';
import BoardsList from './BoardsList';
import LatestThreads from './LatestThreads';

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
      <Footer />
    </Fragment>
  );
};

export default Home;
