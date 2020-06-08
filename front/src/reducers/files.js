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
    case GET_FILE:
      return { ...state, file: payload.file, blob: payload.blob, loading: false, error: null };

    case FILE_ERROR:
      return { ...state, error: payload.data, file: null, blob: null, loading: false };

    default:
      return state;
  }
}
