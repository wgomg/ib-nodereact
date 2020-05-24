import {
  GET_BOARDS_LIST,
  BOARDS_ERROR,
  GET_BOARD,
  DELETE_BOARD,
  CREATE_THREAD,
  THREAD_ERROR,
  CREATE_POST,
  POST_ERROR,
} from '../actions/types';

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

    case CREATE_THREAD:
      return {
        ...state,
        board: { ...state.board, threads: [payload, ...state.board.threads] },
        loading: false,
        error: null,
      };

    case CREATE_POST:
      return {
        ...state,
        board: {
          ...state.board,
          threads: [
            ...state.board.threads
              .map((thread) => {
                if (thread.thread_id === payload.thread_id)
                  return { ...thread, posts: [...thread.posts, payload] };

                return thread;
              })
              .sort((t1, t2) => {
                if (t1.posts.length > 0 && t2.posts.length > 0)
                  return (
                    new Date(t2.posts[t2.posts.length - 1].created_on) -
                    new Date(t1.posts[t1.posts.length - 1].created_on)
                  );
              }),
          ],
        },
        loading: false,
        error: null,
      };

    case BOARDS_ERROR:
    case THREAD_ERROR:
    case POST_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
