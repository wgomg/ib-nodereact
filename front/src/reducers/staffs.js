import { GET_STAFFS, GET_STAFF, STAFF_ERROR, DELETE_STAFF } from '../actions/types';

const initState = {
  staffs: null,
  staff: null,
  loading: true,
  error: {}
};

export default function(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_STAFFS:
      return { ...state, staffs: payload, staff: null, loading: false, error: {} };

    case GET_STAFF:
      return { ...state, staffs: null, staff: payload, loading: false, error: {} };

    case DELETE_STAFF:
      return {
        ...state,
        staffs: state.staffs.filter(staff => staff.staff_id !== payload),
        loading: false,
        error: {}
      };

    case STAFF_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
