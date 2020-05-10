import axios from 'axios';

import { GET_THEME, GET_THEMES, THEMES_ERROR, DELETE_THEME } from './types';

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

export const createTheme = (newTheme, history) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/themes', newTheme, config);

    const data = res.data.length > 0 ? res.data[0] : {};

    dispatch({ type: GET_THEME, payload: data });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({ type: THEMES_ERROR, payload: error.response });
  }
};

export const editTheme = (editedTheme, history) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.put('/themes', editedTheme, config);

    const data = res.data.length > 0 ? res.data[0] : {};

    dispatch({ type: GET_THEME, payload: data });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({ type: THEMES_ERROR, payload: error.response });
  }
};

export const deleteTheme = (theme_id) => async (dispatch) => {
  try {
    await axios.delete(`/themes/${theme_id}`);

    dispatch({ type: DELETE_THEME, payload: theme_id });
  } catch (error) {
    dispatch({
      type: THEMES_ERROR,
      payload: error.response,
    });
  }
};
