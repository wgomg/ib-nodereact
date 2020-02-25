import { combineReducers } from 'redux';
import login from './login';
import boards from './boards';
import posts from './posts';

export default combineReducers({ login, boards, posts });
