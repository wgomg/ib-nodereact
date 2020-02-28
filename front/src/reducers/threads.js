import { CREATE_THREAD, THREAD_ERROR } from '../actions/types';

const initState = {
  thread: null,
  loading: true,
  error: {}
};

export default function(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_THREAD:
      return { ...state, thread: payload, loading: false };

    case THREAD_ERROR:
      return { ...state, error: payload, loading: false };

    default:
      return state;
  }
}
