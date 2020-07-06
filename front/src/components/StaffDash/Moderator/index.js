import React, { Fragment } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import BannersList from '../banners/BannersList';
import CreateBanner from '../banners/CreateBanner';
//
import RulesList from '../rules/RulesList';
import CreateRule from '../rules/CreateRule';
//
import ReportsList from '../reports/ReportsList';
//
import ChangePassword from '../ChangePassword';

export default ({ board_id, staff_id }) => {
  return (
    <Fragment>
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
          <p className='centered'>
            [ <Link to={`dash/change-password/${staff_id}`}>contraseña</Link> ]{' '}
          </p>
          <div className='container centered'>
            <div className='columns'>
              <BannersList board_id={board_id} />
              <RulesList board_id={board_id} />
            </div>
          </div>
          <div className='container centered'>
            <div className='columns'>
              <ReportsList board_id={board_id} />
            </div>
          </div>
        </Fragment>
      </Switch>
    </Fragment>
  );
};
