import { combineReducers } from 'redux';
import auth from './auth';
import boards from './boards';
import banners from './banners';
import staffs from './staffs';
import rules from './rules';
import threads from './threads';
import themes from './themes';
import tags from './tags';
import posts from './posts';

export default combineReducers({
  auth,
  boards,
  banners,
  staffs,
  rules,
  threads,
  themes,
  tags,
  posts,
});
