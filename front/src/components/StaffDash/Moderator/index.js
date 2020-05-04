import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import BannersList from '../banners/BannersList';
import CreateBanner from '../banners/CreateBanner';
//
import RulesList from '../rules/RulesList';
import CreateRule from '../rules/CreateRule';
//
import ChangePassword from '../ChangePassword';

//
import StaffNavbar from '../StaffNavbar';

export default ({ board_id }) => {
  return (
    <Fragment>
      <StaffNavbar />
      <Switch>
        <Route
          exact
          path='/staff/dash/create-banner'
          component={(props) => <CreateBanner {...props} board_id={board_id} />}
        />
        <Route
          exact
          path='/staff/dash/create-rule'
          component={(props) => <CreateRule {...props} board_id={board_id} />}
        />
        <Route exact path='/staff/dash/change-password/:staff_id' component={ChangePassword} />
        <Fragment>
          <div className='container centered'>
            <div className='columns'>
              <BannersList board_id={board_id} />
              <RulesList board_id={board_id} />
            </div>
          </div>
        </Fragment>
      </Switch>
    </Fragment>
  );
};
