import _ from 'lodash';
import {
	SET_WELCOME_MESSAGE
} from '../constants/action-types';

let initialState = {
	message: 'hello'
};

export default function welcome(state=initialState, action) {
	switch (action.type) {
		case SET_WELCOME_MESSAGE:
			return _.assign({}, state, {
				message: action.message
			});

		default:
			return state;
	}
}
