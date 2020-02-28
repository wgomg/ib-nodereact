import { GET_BANNERS, BOARDS_ERROR } from '../actions/types';

const initState = {
  banners: [],
  loading: true,
  error: {}
};

export default function(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BANNERS:
      return { ...state, banners: payload, loading: false };

    case BOARDS_ERROR:
      return { ...state, error: payload, loading: false };

    default:
      return state;
  }
}
