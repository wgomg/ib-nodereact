import axios from 'axios';

import { GET_STAFFS, STAFF_ERROR } from './types';

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
