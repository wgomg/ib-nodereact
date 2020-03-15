import { GET_STAFFS, STAFF_ERROR } from '../actions/types';

const initState = {
  staffs: null,
  loading: true,
  error: {}
};

export default function(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_STAFFS:
      return { ...state, staffs: payload, loading: false };

    case STAFF_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
