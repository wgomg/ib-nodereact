import { GET_BOARDS_LIST, BOARDS_ERROR, GET_BOARD, DELETE_BOARD } from '../actions/types';

const initState = {
  boards: [],
  board: {},
  loading: true,
  error: null,
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BOARDS_LIST:
      return { ...state, boards: payload, loading: false, error: null };

    case GET_BOARD:
      return { ...state, board: payload, loading: false, error: null };

    case DELETE_BOARD:
      return {
        ...state,
        boards: state.boards.filter((board) => board.board_id !== payload),
        loading: false,
        error: null,
      };

    case BOARDS_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
