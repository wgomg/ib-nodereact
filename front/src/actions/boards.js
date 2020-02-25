import axios from 'axios';

import { GET_BOARDS_LIST, BOARDS_ERROR } from './types';

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
