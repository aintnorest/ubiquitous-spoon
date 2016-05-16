import createReducer from '../../utils/createReducer';
import {
    ADD_MESSAGE,
    SET_PLAYERS,
    SET_MESSAGE,
    SET_MESSAGE_ERROR,
    SET_MESSAGE_SENDING
} from '../../constants/action-types';

const initialState = {
    messages: [],
    players: [],
    messageSending: false,
    messageError: null,
    message: null
};

export default createReducer(initialState, {
    [SET_MESSAGE_ERROR]: (state, messageError) => ({ ...state, messageError }),
    [SET_MESSAGE_SENDING]: (state, messageSending) => ({ ...state, messageSending }),
    [SET_MESSAGE]: (state, message) => ({ ...state, message }),
    [SET_PLAYERS]: (state, players) => ({ ...state, players }),
    [ADD_MESSAGE]: (state, message) => {
        const nextMessages = state.messages.slice();
        nextMessages.push(message);
        return {...state, messages: nextMessages};
    }
});
