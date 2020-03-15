import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Logo, Home, Footer, Board, BoardsNavbar, Login, StaffNavbar, StaffDash } from './components';

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
            <Route exact path='/' component={Logo} />
            {/* <Route exact path='/error' component={Error} /> */}
            <Route exact path='/staff/login' component={BoardsNavbar} />
            <Route exact path='/staff*' component={StaffNavbar} />
            <Route exact path='/*' component={BoardsNavbar} />
          </Switch>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/staff/login' component={Login} />
            <Route exact path='/staff*' component={StaffDash} />
            <Route exact path='/:board_uri' component={Board} />
            {/* <Route exact path='/:board_uri/:thread_id/:post_id' component={Thread} /> */}
          </Switch>
          <Footer />
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
