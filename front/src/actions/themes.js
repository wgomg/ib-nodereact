import axios from 'axios';

import { GET_THEME, GET_THEMES, THEMES_ERROR } from './types';

export const getThemes = () => async (dispatch) => {
  try {
    const res = await axios.get('/themes');

    dispatch({ type: GET_THEMES, payload: res.data });
  } catch (error) {
    dispatch({
      type: THEMES_ERROR,
      payload: error.response,
    });
  }
};

export const getTheme = (name) => async (dispatch) => {
  try {
    const res = await axios.get(`/themes/${name}`);

    const data = res.data.length > 0 ? res.data[0] : {};

    dispatch({ type: GET_THEME, payload: data });
  } catch (error) {
    dispatch({
      type: THEMES_ERROR,
      payload: error.response,
    });
  }
};
