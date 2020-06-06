import React, { Fragment } from 'react';

import StaffsList from './staff/StaffsList';
import BoardsList from './boards/BoardsList';
import BannersList from '../banners/BannersList';
import RulesList from '../rules/RulesList';
import TagsList from './tags/TagsList';
import ThemesList from './themes/ThemesList';
import ReportsList from '../reports/ReportsList';

export default () => (
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
        <div className='col-5' />
      </div>
    </div>
  </Fragment>
);
