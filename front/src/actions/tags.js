import axios from 'axios';

import { GET_TAGS, GET_TAG, TAGS_ERROR, DELETE_TAG } from './types';

export const getTags = () => async (dispatch) => {
  try {
    const res = await axios.get('/_back/api/tags');

    dispatch({ type: GET_TAGS, payload: res.data });
  } catch (error) {
    dispatch({ type: TAGS_ERROR, payload: error.response });
  }
};

export const createTag = (newTag, history) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/_back/api/tags', newTag, config);

    dispatch({ type: GET_TAG, payload: res.data });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({ type: TAGS_ERROR, payload: error.response });
  }
};

export const deleteTag = (tag_id) => async (dispatch) => {
  try {
    await axios.delete(`/_back/api/tags/${tag_id}`);

    dispatch({ type: DELETE_TAG, payload: tag_id });
  } catch (error) {
    dispatch({
      type: TAGS_ERROR,
      payload: error.response,
    });
  }
};
