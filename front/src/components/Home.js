import React, { Fragment } from 'react';

import { Logo, BoardsList, LatestPosts, Statistics } from './home';
import Footer from './Footer';

const Home = () => {
  return (
    <Fragment>
      <Logo />
      <div className='container centered'>
        <div className='columns'>
          <BoardsList />
          <LatestPosts />
        </div>
      </div>
      <Statistics />
      <Footer />
    </Fragment>
  );
};

export default Home;
