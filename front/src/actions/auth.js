import axios from 'axios';

import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, STAFF_LOADED, STAFF_LOAD_ERROR } from './types';

import setAuthToken from '../utils/setAuthToken';

export const loadStaff = () => async (dispatch) => {
  if (localStorage.token) setAuthToken(localStorage.token);

  try {
    const res = await axios.get('/_back/api/staffs/auth');

    dispatch({
      type: STAFF_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: STAFF_LOAD_ERROR,
      payload: error.response,
    });
  }
};

export const login = (staffData) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/_back/api/staffs/login', staffData, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.length > 0 ? res.data[0] : [],
    });

    dispatch(loadStaff());
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response,
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT, payload: { data: null } });
};
