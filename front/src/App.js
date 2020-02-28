import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Logo, Home, Footer, Board, Navbar } from './components';

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
          <Switch>
            <Route exact path='/' component={Logo} />
            {/* <Route exact path='/error' component={Error} /> */}
            <Route exact path='/*' component={Navbar} />
            {/* <Route exact path='/*' component={Banner} /> */}
          </Switch>
          <Switch>
            <Route exact path='/' component={Home} />
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
