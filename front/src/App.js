import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import StaffDash from './components/StaffDash';
import Boards from './components/Boards';
import { ViewImage } from './components/common';

import { Provider } from 'react-redux';
import store from './store';

import { loadStaff } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './custom.css';

if (localStorage.token) setAuthToken(localStorage.token);

function App() {
  useEffect(() => {
    store.dispatch(loadStaff());
  });

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Switch>
            <Route exact path='/data/:img' component={ViewImage} />
            <Route exact path='/' component={Home} />
            <Route path='/staff' component={StaffDash} />
            <Route path='/' component={Boards} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
