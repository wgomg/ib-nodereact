import React, { useEffect } from 'react';

import { loadStaff } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import { Provider } from 'react-redux';
import store from './store';

import IB from './components/IB';

if (localStorage.token) setAuthToken(localStorage.token);

function App() {
  useEffect(() => {
    store.dispatch(loadStaff());
  });

  return (
    <Provider store={store}>
      <IB />
    </Provider>
  );
}

export default App;
