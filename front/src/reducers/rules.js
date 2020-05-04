import { GET_RULE, GET_RULES, RULES_ERROR, DELETE_RULE } from '../actions/types';

const initState = {
  rules: [],
  loading: true,
  error: {},
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_RULE:
      return { ...state, rules: [...state.rules, payload], loading: false, error: {} };

    case GET_RULES:
      return { ...state, rules: payload, loading: false, error: {} };

    case DELETE_RULE:
      return {
        ...state,
        rules: state.rules.filter((rule) => rule.rule_id !== payload),
        loading: false,
        error: {},
      };

    case RULES_ERROR:
      return { ...state, error: payload.data, loading: false };

    default:
      return state;
  }
}
