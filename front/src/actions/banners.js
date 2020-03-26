import axios from 'axios';

import { GET_BANNERS, GET_BANNER, DELETE_BANNER, BANNERS_ERROR } from './types';

export const getBanners = () => async dispatch => {
  try {
    const res = await axios.get('/banners');

    dispatch({
      type: GET_BANNERS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: BANNERS_ERROR,
      payload: error.response
    });
  }
};

export const getBoardBanners = board_id => async dispatch => {
  try {
    const res = await axios.get(`/banners/${board_id}`);

    dispatch({
      type: GET_BANNERS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: BANNERS_ERROR,
      payload: error.response
    });
  }
};

export const getBanner = banner_id => async dispatch => {
  try {
    const res = await axios.get(`/banners/${banner_id}`);

    dispatch({
      type: GET_BANNER,
      payload: res.data.length > 0 ? res.data[0] : []
    });
  } catch (error) {
    dispatch({
      type: BANNERS_ERROR,
      payload: error.response
    });
  }
};

export const createBanner = (newBanner, history) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    const res = await axios.post('/banners', newBanner, config);

    dispatch({
      type: GET_BANNER,
      payload: res.data
    });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({
      type: BANNERS_ERROR,
      payload: error.response
    });
  }
};

export const editBanner = (editedBanner, history) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.put('/banners', editedBanner, config);

    dispatch({
      type: GET_BANNER,
      payload: res.data
    });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({
      type: BANNERS_ERROR,
      payload: error.response
    });
  }
};

export const deleteBanner = banner_id => async dispatch => {
  try {
    await axios.delete(`/banners/${banner_id}`);

    dispatch({ type: DELETE_BANNER, payload: banner_id });
  } catch (error) {
    dispatch({
      type: BANNERS_ERROR,
      payload: error.response
    });
  }
};
