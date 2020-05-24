import { GET_STAFFS, GET_STAFF, STAFF_ERROR, DELETE_STAFF } from '../actions/types';

const initState = {
  staffs: [],
  staff: {},
  loading: true,
  error: null,
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_STAFFS:
      return { ...state, staffs: payload, staff: {}, loading: false, error: null };

    case GET_STAFF:
      return { ...state, staffs: [], staff: payload, loading: false, error: null };

    case DELETE_STAFF:
      return {
        ...state,
        staffs: state.staffs.filter((staff) => staff.staff_id !== payload),
        loading: false,
        error: null,
      };

    case STAFF_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
