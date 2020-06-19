import {
  LOCSTOR_ADD_HIDDPOST,
  LOCSTOR_ADD_HIDDTHREAD,
  LOCSTOR_GET_HIDDPOSTS,
  LOCSTOR_GET_HIDDTHREADS,
  LOCSTOR_REMOVE_HIDDPOST,
  LOCSTOR_REMOVE_HIDDTHREAD,
} from './types';

import localStorage from '../utils/localStorage';

export const getHiddenThreads = () => (dispatch) => {
  dispatch({ type: LOCSTOR_GET_HIDDTHREADS, payload: localStorage.getHiddenThreads() });
};

export const getHiddenPosts = () => (dispatch) => {
  dispatch({ type: LOCSTOR_GET_HIDDPOSTS, payload: localStorage.getHiddenPosts() });
};

export const hideThread = (thread_id) => (dispatch) => {
  localStorage.addHiddenThread(thread_id);

  dispatch({
    type: LOCSTOR_ADD_HIDDTHREAD,
    payload: thread_id,
  });
};

export const hidePost = (post_id) => (dispatch) => {
  localStorage.addHiddenPost(post_id);

  dispatch({
    type: LOCSTOR_ADD_HIDDPOST,
    payload: post_id,
  });
};

export const unhideThread = (thread_id) => (dispatch) => {
  localStorage.removeHiddenThread(thread_id);

  dispatch({
    type: LOCSTOR_REMOVE_HIDDTHREAD,
    payload: thread_id,
  });
};

export const unhidePost = (post_id) => (dispatch) => {
  localStorage.removeHiddenPost(post_id);

  dispatch({
    type: LOCSTOR_REMOVE_HIDDPOST,
    payload: post_id,
  });
};
