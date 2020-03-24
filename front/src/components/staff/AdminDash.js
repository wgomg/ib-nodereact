import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import StaffsList from './StaffsList';
import BoardsList from './BoardsList';
import CreateBoard from './CreateBoard';
import EditBoard from './EditBoard';
import CreateStaff from './CreateStaff';
import EditStaff from './EditStaff';
import ChangePassword from './ChangePassword';

import StaffNavbar from './StaffNavbar';

export default () => (
  <Fragment>
    <StaffNavbar />
    <Switch>
      <Route exact path='/staff/dash/create-board' component={CreateBoard} />
      <Route exact path='/staff/dash/edit-board/:board_uri' component={EditBoard} />
      <Route exact path='/staff/dash/create-staff' component={CreateStaff} />
      <Route exact path='/staff/dash/edit-staff/:staff_id' component={EditStaff} />
      <Route exact path='/staff/dash/change-password/:staff_id' component={ChangePassword} />
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
