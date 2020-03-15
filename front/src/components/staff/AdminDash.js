import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import StaffsList from './StaffsList';
import BoardsList from './BoardsList';
import CreateBoard from './CreateBoard';

export default () => (
  <Fragment>
    <Switch>
      <Route exact path='/staff/create-board' component={CreateBoard} />
      <Fragment>
        <StaffsList />
        <BoardsList />
      </Fragment>
    </Switch>
  </Fragment>
);
