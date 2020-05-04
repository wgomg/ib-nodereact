import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import StaffsList from './staff/StaffsList';
import CreateStaff from './staff/CreateStaff';
import EditStaff from './staff/EditStaff';
import ChangePassword from '../ChangePassword';
//
import BoardsList from './boards/BoardsList';
import CreateBoard from './boards/CreateBoard';
import EditBoard from './boards/EditBoard';
//
import BannersList from '../banners/BannersList';
import CreateBanner from '../banners/CreateBanner';
import EditBanner from '../banners/EditBanner';
//
import RulesList from '../rules/RulesList';
import CreateRule from '../rules/CreateRule';

//
import StaffNavbar from '../StaffNavbar';

export default () => (
  <Fragment>
    <StaffNavbar />
    <Switch>
      <Route exact path='/staff/dash/create-board' component={CreateBoard} />
      <Route exact path='/staff/dash/edit-board/:board_uri' component={EditBoard} />
      <Route exact path='/staff/dash/create-staff' component={CreateStaff} />
      <Route exact path='/staff/dash/edit-staff/:staff_id' component={EditStaff} />
      <Route exact path='/staff/dash/change-password/:staff_id' component={ChangePassword} />
      <Route exact path='/staff/dash/create-banner' component={CreateBanner} />
      <Route exact path='/staff/dash/edit-banner/:banner_id' component={EditBanner} />
      <Route exact path='/staff/dash/create-rule' component={CreateRule} />
      <Fragment>
        <div className='container centered'>
          <div className='columns'>
            <StaffsList />
            <BoardsList />
          </div>
        </div>
        <div className='container centered'>
          <div className='columns'>
            <BannersList />
            <RulesList />
          </div>
        </div>
      </Fragment>
    </Switch>
  </Fragment>
);
