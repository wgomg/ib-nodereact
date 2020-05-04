import { GET_LATEST_POSTS, LATEST_POSTS_ERROR } from '../actions/types';

const initState = {
  latests: [],
  loading: true,
  error: {},
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_LATEST_POSTS:
      return { ...state, latests: payload, loading: false };

    case LATEST_POSTS_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
