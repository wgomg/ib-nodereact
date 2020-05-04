import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Login from './Login';
import Dash from './Dash';
import { Footer } from '../common';

export default () => {
  return (
    <Fragment>
      <Redirect from='/staff/' to='/staff/login' />
      <Switch>
        <Route exact path='/staff/login' component={Login} />
        <Route path='/staff/dash' component={Dash} />
      </Switch>
      <Footer />
    </Fragment>
  );
};
