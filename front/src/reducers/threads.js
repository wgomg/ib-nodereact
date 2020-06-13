import {
  GET_LATEST_THREADS,
  THREAD_ERROR,
  GET_THREADS,
  CREATE_THREAD,
  GET_THREAD,
  CREATE_POST,
  POST_ERROR,
} from '../actions/types';

const initState = {
  latests: [],
  threads: [],
  thread: null,
  loading: true,
  error: null,
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_LATEST_THREADS:
      return { ...state, latests: payload, loading: false, error: null };

    case GET_THREADS:
      return { ...state, threads: payload, loading: false, error: null };

    case CREATE_THREAD:
      return {
        ...state,
        threads: [payload, ...state.threads],
        loading: false,
        error: null,
      };

    case CREATE_POST:
      return {
        ...state,
        thread: { ...state.thread, posts: [...state.thread.posts, payload] },
        loading: false,
        error: null,
      };

    case GET_THREAD:
      return { ...state, thread: payload, loading: false, error: null };

    case POST_ERROR:
    case THREAD_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
