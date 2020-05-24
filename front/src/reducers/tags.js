import { GET_TAGS, GET_TAG, TAGS_ERROR, DELETE_TAG } from '../actions/types';

const initState = {
  tags: [],
  tag: {},
  loading: true,
  error: null,
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TAGS:
      return { ...state, tags: payload, loading: false, error: null };

    case GET_TAG:
      return { ...state, tag: payload, loading: false, error: null };

    case TAGS_ERROR:
      return { ...state, error: payload.data, loading: false };

    case DELETE_TAG:
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.tag_id !== payload),
        loading: false,
        error: null,
      };

    default:
      return state;
  }
}
