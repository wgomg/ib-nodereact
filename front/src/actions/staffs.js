import axios from 'axios';

import { GET_STAFFS, GET_STAFF, DELETE_STAFF, STAFF_ERROR } from './types';

export const getStaffs = () => async (dispatch) => {
  try {
    const res = await axios.get('/_back/api/staffs/');

    dispatch({
      type: GET_STAFFS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: STAFF_ERROR,
      payload: error.response,
    });
  }
};

export const createStaff = (newStaff, history) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/_back/api/staffs', newStaff, config);

    dispatch({
      type: GET_STAFF,
      payload: res.data.length > 0 ? res.data[0] : {},
    });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({
      type: STAFF_ERROR,
      payload: error.response,
    });
  }
};

export const editStaff = (editedStaff, history) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.put('/_back/api/staffs', editedStaff, config);

    dispatch({
      type: GET_STAFF,
      payload: res.data.length > 0 ? res.data[0] : {},
    });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({
      type: STAFF_ERROR,
      payload: error.response,
    });
  }
};

export const changePassword = (staff, history) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.put('/_back/api/staffs/password', staff, config);

    dispatch({
      type: GET_STAFF,
      payload: res.data,
    });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({
      type: STAFF_ERROR,
      payload: error.response,
    });
  }
};

export const deleteStaff = (staff_id) => async (dispatch) => {
  try {
    await axios.delete(`/_back/api/staffs/${staff_id}`);

    dispatch({
      type: DELETE_STAFF,
      payload: staff_id,
    });
  } catch (error) {
    dispatch({
      type: STAFF_ERROR,
      payload: error.response,
    });
  }
};
