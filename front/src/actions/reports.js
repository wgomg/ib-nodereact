import axios from 'axios';

import { REPORT_ERROR, CREATE_REPORT, GET_REPORTS } from './types';

export const createReport = (newReport) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/reports', newReport, config);

    dispatch({ type: CREATE_REPORT, payload: 'insertId' in res.data });

    return res.data.length > 0;
  } catch (error) {
    dispatch({ type: REPORT_ERROR, payload: error.response });
  }
};

export const getBoardReports = (board_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/reports/board/${board_id}`);

    dispatch({
      type: GET_REPORTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: REPORT_ERROR, payload: error.response });
  }
};

export const getGlobal = () => async (dispatch) => {
  try {
    const res = await axios.get('/reports/global');

    dispatch({
      type: GET_REPORTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: REPORT_ERROR,
      payload: error.response,
    });
  }
};
