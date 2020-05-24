import { CREATE_REPORT, REPORT_ERROR, GET_REPORTS } from '../actions/types';

const initState = {
  sent: false,
  reports: [],
  loading: true,
  error: null,
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_REPORT:
      return { ...state, sent: payload, loading: false, error: null };

    case GET_REPORTS:
      return { ...state, reports: payload, loading: false, error: null };

    case REPORT_ERROR:
      return { ...state, error: payload.data, sent: false, loading: false };

    default:
      return state;
  }
}
