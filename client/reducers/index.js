import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import appReducer from './app';

export default combineReducers({
	router: routerStateReducer,
	welcome: appReducer
});
