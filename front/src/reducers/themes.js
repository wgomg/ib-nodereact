import { GET_THEME, GET_THEMES, THEMES_ERROR, DELETE_THEME } from '../actions/types';

const initState = {
  themes: [],
  theme: {},
  loading: true,
  error: {},
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_THEMES:
      return { ...state, themes: payload, loading: false, error: {} };

    case GET_THEME:
      return { ...state, theme: payload, loading: false, error: {} };

    case THEMES_ERROR:
      return { ...state, loading: false, error: payload.data };

    case DELETE_THEME:
      return {
        ...state,
        themes: state.themes.filter((theme) => theme.theme_id !== payload),
        loading: false,
        error: {},
      };

    default:
      return state;
  }
}
