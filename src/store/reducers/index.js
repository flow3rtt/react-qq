import { combineReducers } from 'redux';
import user from './user';
import message from './message';
import contacts from './contacts';

export default combineReducers({
  user,
  message,
  contacts
});
