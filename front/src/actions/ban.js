import axios from 'axios';

import { APPLY_BAN, UPDATE_POST, BAN_ERROR } from './types';

export const applyBan = (newBan) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };

    const res = await axios.post('/_back/api/bans', newBan, config);

    dispatch({
      type: APPLY_BAN,
      payload: res.data.length > 0 ? newBan.report_id : null,
    });

    dispatch({
      type: UPDATE_POST,
      payload: res.data.length > 0 ? res.data[0] : {},
    });

    return res.data.length > 0;
  } catch (error) {
    dispatch({
      type: BAN_ERROR,
      payload: error.response,
    });
  }
};
