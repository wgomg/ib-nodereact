import axios from 'axios';

import { GET_BOARDS_LIST, GET_BOARD, BOARDS_ERROR } from './types';

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
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: BOARDS_ERROR,
      payload: error.response
    });
  }
};
