import { GET_BOARDS_LIST, BOARDS_ERROR } from '../actions/types';

const initState = {
  boards: [],
  loading: true,
  error: {}
};

export default function(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BOARDS_LIST:
      return { ...state, boards: payload, loading: false };

    case BOARDS_ERROR:
      return { ...state, error: payload, loading: false };

    default:
      return state;
  }
}
