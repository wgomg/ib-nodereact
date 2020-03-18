import axios from 'axios';

import { GET_STAFFS, GET_STAFF, STAFF_ERROR } from './types';

export const getStaffs = () => async dispatch => {
  try {
    const res = await axios.get('/staffs/');

    dispatch({
      type: GET_STAFFS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: STAFF_ERROR,
      payload: error.response
    });
  }
};

export const createStaff = (newStaff, history) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/staffs', newStaff, config);

    dispatch({
      type: GET_STAFF,
      payload: res.data
    });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({
      type: STAFF_ERROR,
      payload: error.response
    });
  }
};
