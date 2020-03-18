import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import StaffsList from './StaffsList';
import BoardsList from './BoardsList';
import CreateBoard from './CreateBoard';
import EditBoard from './EditBoard';
import CreateStaff from './CreateStaff';
import EditStaff from './EditStaff';

export default () => (
  <Fragment>
    <Switch>
      <Route exact path='/staff/create-board' component={CreateBoard} />
      <Route exact path='/staff/edit-board/:board_uri' component={EditBoard} />
      <Route exact path='/staff/create-staff' component={CreateStaff} />
      <Route exact path='/staff/edit-staff/:staff_id' component={EditStaff} />
      <Fragment>
        <div className='container centered'>
          <div className='columns'>
            <StaffsList />
            <BoardsList />
          </div>
        </div>
      </Fragment>
    </Switch>
  </Fragment>
);
