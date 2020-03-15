import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, STAFF_LOADED, STAFF_LOAD_ERROR } from '../actions/types';

const initState = {
  token: localStorage.getItem('token'),
  logged: false,
  loading: true,
  staff: null,
  error: {}
};

export default function(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, logged: true, loading: false };

    case STAFF_LOADED:
      return { ...state, logged: true, loading: false, staff: payload };

    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return { ...state, token: null, logged: false, loading: false, staff: null };

    case STAFF_LOAD_ERROR:
      localStorage.removeItem('token');
      return { ...state, token: null, logged: false, loading: false, staff: null, error: payload.data };

    default:
      return state;
  }
}
