import {
  LOCSTOR_ADD_HIDDPOST,
  LOCSTOR_ADD_HIDDTHREAD,
  LOCSTOR_GET_HIDDPOSTS,
  LOCSTOR_GET_HIDDTHREADS,
  LOCSTOR_REMOVE_HIDDPOST,
  LOCSTOR_REMOVE_HIDDTHREAD,
} from '../actions/types';

const initState = {
  hiddenPosts: [],
  hiddenThreads: [],
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOCSTOR_ADD_HIDDPOST:
      return { ...state, hiddenPosts: [...state.hiddenPosts, payload] };

    case LOCSTOR_GET_HIDDPOSTS:
      return { ...state, hiddenPosts: payload };

    case LOCSTOR_ADD_HIDDTHREAD:
      return { ...state, hiddenThreads: [...state.hiddenThreads, payload] };

    case LOCSTOR_GET_HIDDTHREADS:
      return { ...state, hiddenThreads: payload };

    case LOCSTOR_REMOVE_HIDDTHREAD:
      return {
        ...state,
        hiddenThreads: state.hiddenThreads.filter((thread_id) => thread_id !== payload),
      };

    case LOCSTOR_REMOVE_HIDDPOST:
      return {
        ...state,
        hiddenPosts: state.hiddenPosts.filter((post_id) => post_id !== payload),
      };

    default:
      return state;
  }
}
