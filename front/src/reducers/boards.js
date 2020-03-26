import {
  GET_BOARDS_LIST,
  BOARDS_ERROR,
  GET_BOARD,
  DELETE_BOARD,
  CREATE_THREAD,
  THREAD_ERROR,
  CREATE_POST,
  POST_ERROR
} from '../actions/types';

const initState = {
  boards: [],
  board: {},
  loading: true,
  error: {}
};

export default function(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BOARDS_LIST:
      return { ...state, boards: payload, board: {}, loading: false, error: {} };

    case GET_BOARD:
      return { ...state, board: payload, loading: false, error: {} };

    case DELETE_BOARD:
      return {
        ...state,
        boards: state.boards.filter(board => board.board_id !== payload),
        loading: false,
        error: {}
      };

    case CREATE_THREAD:
      return {
        ...state,
        board: { ...state.board, threads: [payload, ...state.board.threads] },
        loading: false,
        error: {}
      };

    case CREATE_POST:
      return {
        ...state,
        board: {
          ...state.board,
          threads: [
            ...state.board.threads.map(thread => {
              if (thread.thread_id === payload.thread_id)
                return { ...thread, posts: [...thread.posts, payload] };

              return thread;
            })
          ]
        },
        loading: false,
        error: {}
      };

    case BOARDS_ERROR:
    case THREAD_ERROR:
    case POST_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
