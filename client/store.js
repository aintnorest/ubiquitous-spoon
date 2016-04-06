import _ from 'lodash';
import thunk from 'redux-thunk';
import { createHistory, useBasename } from 'history';
import { reduxReactRouter } from 'redux-router';
import { createStore, compose, applyMiddleware } from 'redux';

import reducer from './reducers';

const logger = () => next => action => {
	console.log(action);
	return next(action);
};

const middlewares = [logger, thunk];

const finalCreateStore = compose(
	applyMiddleware(...middlewares),
	reduxReactRouter({
		createHistory: () => {
			return useBasename(createHistory)({
				basename: 'app' // change this?
			});
		}
	})
)(createStore);

export default function() {
	return finalCreateStore(reducer);
};
