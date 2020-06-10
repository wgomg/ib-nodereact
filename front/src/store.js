import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initState = {};

const middleware = [thunk];

const actionSanitizer = (action) =>
  action.type === 'GET_FILE' && action.payload ? { ...action, payload: '<<LONG_BLOB>>' } : action;

const stateSanitizer = (state) =>
  state.files.blob ? { ...state, files: { ...state.files, blob: '<<LONG_BLOB>>' } } : state;

const composeEnhancers = composeWithDevTools({
  actionSanitizer,
  stateSanitizer,
});

const store = createStore(rootReducer, initState, composeEnhancers(applyMiddleware(...middleware)));

export default store;
