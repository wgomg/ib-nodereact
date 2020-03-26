import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { ViewImage, Home, Staff, Boards } from './components';

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
            <Route exact path='/src/:type/:img' component={ViewImage} />
            <Route exact path='/' component={Home} />
            <Route path='/staff' component={Staff} />
            <Route path='/' component={Boards} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
