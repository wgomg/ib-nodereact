import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Login, StaffDash } from './staff';
import Footer from './Footer';

export default () => {
  return (
    <Fragment>
      <Switch>
        <Route exact path='/staff/login' component={Login} />
        <Route path='/staff/dash' component={StaffDash} />
      </Switch>
      <Footer />
    </Fragment>
  );
};
