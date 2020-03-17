import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import StaffsList from './StaffsList';
import BoardsList from './BoardsList';
import CreateBoard from './CreateBoard';
import EditBoard from './EditBoard';

export default () => (
  <Fragment>
    <Switch>
      <Route exact path='/staff/create-board' component={CreateBoard} />
      <Route exact path='/staff/edit-board/:board_uri' component={EditBoard} />
      <Fragment>
        <StaffsList />
        <BoardsList />
      </Fragment>
    </Switch>
  </Fragment>
);
