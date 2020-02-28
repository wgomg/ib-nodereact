import axios from 'axios';

import { GET_BANNERS, BANNERS_ERROR } from './types';

export const getBanners = board_id => async dispatch => {
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
