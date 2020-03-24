import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import { StaffNavbar, Login, StaffDash } from './staff';
import Footer from './Footer';

const Home = () => {
  return (
    <Fragment>
      <StaffNavbar />
      <Switch>
        <Route exact path='/staff/login' component={Login} />
        <Route exact path='/staff/dash' component={StaffDash} />
      </Switch>
      <Footer />
    </Fragment>
  );
};

export default Home;
