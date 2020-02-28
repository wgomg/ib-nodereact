import axios from 'axios';

import { CREATE_THREAD, THREAD_ERROR } from './types';

export const createThread = newThread => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/threads', newThread, config);

    dispatch({
      type: CREATE_THREAD,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: THREAD_ERROR,
      error: error.response
    });
  }
};
