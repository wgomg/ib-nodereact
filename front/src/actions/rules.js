import axios from 'axios';

import { GET_RULE, GET_RULES, DELETE_RULE, RULES_ERROR } from './types';

export const getBoardRules = (board_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/rules/board/${board_id}`);

    dispatch({
      type: GET_RULES,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: RULES_ERROR,
      payload: error.response,
    });
  }
};

export const getGlobal = () => async (dispatch) => {
  try {
    const res = await axios.get('/rules/global');

    dispatch({
      type: GET_RULES,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: RULES_ERROR,
      payload: error.response,
    });
  }
};

export const createRule = (newRule, history) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/rules', newRule, config);

    dispatch({
      type: GET_RULE,
      payload: res.data[0],
    });

    history.push('/staff/dash');
  } catch (error) {
    dispatch({
      type: RULES_ERROR,
      payload: error.response,
    });
  }
};
export const deleteRule = (rule_id) => async (dispatch) => {
  try {
    console.log(rule_id);

    await axios.delete(`/rules/${rule_id}`);

    dispatch({ type: DELETE_RULE, payload: rule_id });
  } catch (error) {
    dispatch({
      type: RULES_ERROR,
      payload: error.response,
    });
  }
};
