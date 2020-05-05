import { GET_LATEST_THREADS, LATEST_THREADS_ERROR } from '../actions/types';

const initState = {
  latests: [],
  loading: true,
  error: {},
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_LATEST_THREADS:
      return { ...state, latests: payload, loading: false };

    case LATEST_THREADS_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
