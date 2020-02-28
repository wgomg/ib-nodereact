import { combineReducers } from 'redux';
import login from './login';
import boards from './boards';
import banners from './banners';
import threads from './threads';
import posts from './posts';

export default combineReducers({ login, boards, banners, threads, posts });
