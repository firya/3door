import door from './door';
import lists from './lists';
import resources from './resources';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  door,
  lists,
  resources
});

export default rootReducer;