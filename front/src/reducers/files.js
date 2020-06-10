import { GET_FILE, FILE_ERROR } from '../actions/types';

const initState = {
  file: null,
  blob: null,
  loading: true,
  error: null,
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FILE: {
      return {
        ...state,
        file: payload ? payload.file : null,
        blob: payload ? payload.blob : null,
        loading: false,
        error: null,
      };
    }

    case FILE_ERROR:
      return { ...state, error: payload, file: null, blob: null, loading: false };

    default:
      return state;
  }
}
