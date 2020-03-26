import { GET_BANNERS, GET_BANNER, BANNERS_ERROR, DELETE_BANNER } from '../actions/types';

const initState = {
  banners: [],
  banner: {},
  loading: true,
  error: {}
};

export default function(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BANNERS:
      return { ...state, banners: payload, loading: false };

    case GET_BANNER:
      return { ...state, banners: [], banner: payload, loading: false, error: {} };

    case DELETE_BANNER:
      return {
        ...state,
        banners: state.banners.filter(banner => banner.banner_id !== payload),
        loading: false,
        error: {}
      };

    case BANNERS_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
