import { GET_STAFFS, GET_STAFF, STAFF_ERROR } from '../actions/types';

const initState = {
  staffs: [],
  loading: true,
  error: null,
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_STAFFS:
      return { ...state, staffs: payload, loading: false, error: null };

    case GET_STAFF:
      return {
        ...state,
        staffs: [...state.staffs.filter((staff) => staff.staff_id !== payload.staff_id), payload],
        loading: false,
        error: null,
      };

    case STAFF_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
