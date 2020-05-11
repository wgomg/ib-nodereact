import { GET_POST, POST_ERROR } from '../actions/types';

const initState = {
  post: null,
  loading: true,
  error: {},
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POST:
      return { ...state, post: payload, loading: false, error: {} };

    case POST_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
