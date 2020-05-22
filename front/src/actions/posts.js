import axios from 'axios';

import { GET_POST, POST_ERROR } from '../actions/types';

export const getPost = (post_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/_back/api/posts/${post_id}`);

    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: error.response,
    });
  }
};
