import axios from 'axios';

import { GET_LATEST_POSTS, LATEST_POSTS_ERROR } from './types';

export const getLatestPosts = () => async dispatch => {
  try {
    const res = await axios.get('/posts/latests');

    dispatch({
      type: GET_LATEST_POSTS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: LATEST_POSTS_ERROR,
      payload: error.response
    });
  }
};
