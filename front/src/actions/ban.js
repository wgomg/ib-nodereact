import axios from 'axios';

import { APPLY_BAN, BAN_ERROR } from './types';

export const applyBan = (newBan) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/_back/api/bans', newBan, config);

    dispatch({
      type: APPLY_BAN,
      payload: res.data ? newBan.report_id : null,
    });
  } catch (error) {
    dispatch({
      type: BAN_ERROR,
      payload: error.response,
    });
  }
};
