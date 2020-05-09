import { combineReducers } from 'redux';
import auth from './auth';
import boards from './boards';
import banners from './banners';
import posts from './posts';
import staffs from './staffs';
import rules from './rules';
import threads from './threads';
import themes from './themes';
import tags from './tags';

export default combineReducers({ auth, boards, banners, posts, staffs, rules, threads, themes, tags });
