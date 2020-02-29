import { GET_BOARDS_LIST, BOARDS_ERROR, GET_BOARD } from '../actions/types';

const initState = {
  boards: [],
  board: [],
  loading: true,
  error: {}
};

export default function(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BOARDS_LIST:
      return { ...state, boards: payload, loading: false };

    case GET_BOARD:
      return { ...state, board: payload, loading: false };

    case BOARDS_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
