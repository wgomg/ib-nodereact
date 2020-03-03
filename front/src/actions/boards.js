import axios from 'axios';

import { GET_BOARDS_LIST, GET_BOARD, BOARDS_ERROR, CREATE_THREAD, THREAD_ERROR } from './types';

export const getBoardsList = () => async dispatch => {
  try {
    const res = await axios.get('/boards');

    dispatch({
      type: GET_BOARDS_LIST,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: BOARDS_ERROR,
      payload: error.response
    });
  }
};

export const getBoard = uri => async dispatch => {
  try {
    const res = await axios.get(`/boards/${uri}`);

    dispatch({
      type: GET_BOARD,
      payload: res.data.length > 0 ? res.data[0] : []
    });
  } catch (error) {
    dispatch({
      type: BOARDS_ERROR,
      payload: error.response
    });
  }
};

export const createThread = newThread => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/threads', newThread, config);

    const payload = res.data.length > 0 ? res.data[0] : [];

    dispatch({
      type: CREATE_THREAD,
      payload
    });
  } catch (error) {
    dispatch({
      type: THREAD_ERROR,
      payload: error.response
    });
  }
};
