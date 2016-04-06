import * as types from '../constants/action-types';

export function setWelcomeMessage(message) {
	return {
		type: types.SET_WELCOME_MESSAGE,
		message
	};
}
