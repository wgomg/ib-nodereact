import axios from 'axios';

import { GET_LATEST_THREADS, LATEST_THREADS_ERROR } from './types';

export const getLatestThreads = () => async (dispatch) => {
  try {
    const res = await axios.get('/threads/latests');

    dispatch({
      type: GET_LATEST_THREADS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: LATEST_THREADS_ERROR,
      payload: error.response,
    });
  }
};
