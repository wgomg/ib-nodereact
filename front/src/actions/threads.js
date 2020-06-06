import axios from 'axios';

import {
  GET_LATEST_THREADS,
  THREAD_ERROR,
  GET_THREADS,
  CREATE_THREAD,
  GET_THREAD,
  CREATE_POST,
  POST_ERROR,
} from './types';

export const getLatestThreads = () => async (dispatch) => {
  try {
    const res = await axios.get('/_back/api/threads/latests');

    dispatch({
      type: GET_LATEST_THREADS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: THREAD_ERROR,
      payload: error.response,
    });
  }
};

export const createThread = (newThread) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    const res = await axios.post('/_back/api/threads', newThread, config);

    dispatch({
      type: CREATE_THREAD,
      payload: res.data.length > 0 ? res.data[0] : {},
    });

    if (res.data[0]) return true;
  } catch (error) {
    dispatch({
      type: THREAD_ERROR,
      payload: error.response,
    });
  }
};

export const getThreads = (board_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/_back/api/boards/threads/${board_id}`);

    dispatch({
      type: GET_THREADS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: THREAD_ERROR,
      payload: error.response,
    });
  }
};

export const getThread = (thread_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/_back/api/threads/${thread_id}`);

    dispatch({
      type: GET_THREAD,
      payload: res.data.length > 0 ? res.data[0] : {},
    });
  } catch (error) {
    dispatch({
      type: THREAD_ERROR,
      payload: error.response,
    });
  }
};

export const createPost = (newPost) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    const res = await axios.post('/_back/api/posts', newPost, config);

    dispatch({
      type: CREATE_POST,
      payload: res.data[0],
    });

    if (res.data[0]) return true;
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: error.response,
    });
  }
};
