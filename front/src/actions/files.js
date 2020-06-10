import axios from 'axios';

import { GET_FILE, FILE_ERROR } from './types';

export const getFileBlob = (file_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/_back/api/files/blob/${file_id}`);

    dispatch({ type: GET_FILE, payload: res.data.length > 0 ? res.data[0] : null });

    return res.data.length > 0;
  } catch (error) {
    dispatch({
      type: FILE_ERROR,
      payload: error.response,
    });
  }
};
