import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Logo, Home, Footer } from './components';

import { Provider } from 'react-redux';
import store from './store';

import { loadStaff } from './actions/login';
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
          <Logo />
          <Route exact path='/' component={Home} />
          <Switch>
            {/* <Route exact path='/:board_uri/:thread_id/:post_id' component={Thread} /> */}
          </Switch>
          <Footer />
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
