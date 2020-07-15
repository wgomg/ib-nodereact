import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import StaffsList from './staff/StaffsList';
import StaffForm from './staff/StaffForm';
import ChangePassword from '../ChangePassword';
//
import BoardsList from './boards/BoardsList';
import BoardForm from './boards/BoardForm';
//
import BannersList from '../banners/BannersList';
import CreateBanner from '../banners/CreateBanner';
//
import RulesList from '../rules/RulesList';
import CreateRule from '../rules/CreateRule';
//
import CreateTag from './tags/CreateTag';
import TagsList from './tags/TagsList';
//
import ThemeForm from './themes/ThemeForm';
import ThemesList from './themes/ThemesList';
//
import ReportsList from '../reports/ReportsList';

export default () => (
  <Fragment>
    <Switch>
      <Route
        exact
        path='/staff/dash/create-board'
        render={(props) => <BoardForm {...props} mode='create' />}
      />
      <Route
        exact
        path='/staff/dash/edit-board/:board_uri'
        render={(props) => <BoardForm {...props} mode='edit' />}
      />

      <Route
        exact
        path='/staff/dash/create-staff'
        render={(props) => <StaffForm {...props} mode='create' />}
      />
      <Route
        exact
        path='/staff/dash/edit-staff/:staff_id'
        render={(props) => <StaffForm {...props} mode='edit' />}
      />
      <Route exact path='/staff/dash/change-password/:staff_id' component={ChangePassword} />

      <Route exact path='/staff/dash/create-banner' component={CreateBanner} />

      <Route exact path='/staff/dash/create-rule' component={CreateRule} />

      <Route exact path='/staff/dash/create-tag' component={CreateTag} />

      <Route
        exact
        path='/staff/dash/create-theme'
        render={(props) => <ThemeForm {...props} mode='create' />}
      />
      <Route
        exact
        path='/staff/dash/edit-theme/:name'
        render={(props) => <ThemeForm {...props} mode='edit' />}
      />

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
        <div className='container centered'>
          <div className='columns'>
            <TagsList />
            <ThemesList />
          </div>
        </div>
        <div className='container centered'>
          <div className='columns'>
            <ReportsList />
          </div>
        </div>
      </Fragment>
    </Switch>
  </Fragment>
);
