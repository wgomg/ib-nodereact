import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../actions/types';

const initState = {
  token: localStorage.getItem('token'),
  logged: false,
  loading: true,
  staff: null
};

export default function(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, logged: true, loading: false };

    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return { ...state, token: null, logged: false, loading: false, staff: null };

    default:
      return state;
  }
}
