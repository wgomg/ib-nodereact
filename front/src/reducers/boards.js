import { GET_BOARDS_LIST, BOARDS_ERROR, GET_BOARD, CREATE_THREAD, THREAD_ERROR } from '../actions/types';

const initState = {
  boards: null,
  board: null,
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

    case CREATE_THREAD:
      return {
        ...state,
        board: { ...state.board, threads: [payload, ...state.board.threads] },
        loading: false
      };

    case BOARDS_ERROR:
      return { ...state, error: payload.data, loading: false };

    case THREAD_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
