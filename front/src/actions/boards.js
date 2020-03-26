import axios from 'axios';

import {
  GET_BOARDS_LIST,
  GET_BOARD,
  DELETE_BOARD,
  BOARDS_ERROR,
  CREATE_THREAD,
  THREAD_ERROR,
  CREATE_POST,
  POST_ERROR
} from './types';

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

export const createBoard = (newBoard, history) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/boards', newBoard, config);

    dispatch({
      type: GET_BOARD,
      payload: res.data
    });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({
      type: BOARDS_ERROR,
      payload: error.response
    });
  }
};

export const editBoard = (editedBoard, history) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.put('/boards', editedBoard, config);

    dispatch({
      type: GET_BOARD,
      payload: res.data
    });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({
      type: BOARDS_ERROR,
      payload: error.response
    });
  }
};

export const deleteBoard = board_id => async dispatch => {
  try {
    await axios.delete(`/boards/${board_id}`);

    dispatch({
      type: DELETE_BOARD,
      payload: board_id
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
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    const res = await axios.post('/threads', newThread, config);

    dispatch({
      type: CREATE_THREAD,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: THREAD_ERROR,
      payload: error.response
    });
  }
};

export const createPost = newPost => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    const res = await axios.post('/posts', newPost, config);

    dispatch({
      type: CREATE_POST,
      payload: res.data[0]
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: error.response
    });
  }
};
