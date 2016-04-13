import _ from 'lodash';
import {
	SET_APP_NAME
} from '../constants/action-types';

let initialState = {
	appName: 'Ubiquitous Spoon'
};

export default function app(state=initialState, action) {
	switch (action.type) {
		case SET_APP_NAME:
			return _.assign({}, state, {
				appName: action.appName
			});

		default:
			return state;
	}
}
