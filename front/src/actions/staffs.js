import axios from 'axios';

import { GET_STAFFS, GET_STAFF, DELETE_STAFF, STAFF_ERROR } from './types';

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

export const getStaff = staff_id => async dispatch => {
  try {
    const res = await axios.get(`/staffs/${staff_id}`);

    dispatch({
      type: GET_STAFF,
      payload: res.data.length > 0 ? res.data[0] : []
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

export const editStaff = (editedStaff, history) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.put('/staffs', editedStaff, config);

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

export const deleteStaff = staff_id => async dispatch => {
  try {
    await axios.delete(`/staffs/${staff_id}`);

    dispatch({
      type: DELETE_STAFF,
      payload: staff_id
    });
  } catch (error) {
    dispatch({
      type: STAFF_ERROR,
      payload: error.response
    });
  }
};
