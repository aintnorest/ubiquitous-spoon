import createReducer from '../utils/createReducer';
import * as types from '../constants/action-types';

const initialState = {
    userName: null,
    signedIn: false,
    errorMessage: null,
    serverConnected: false
};

export default createReducer(initialState, {
    [types.SET_USER_NAME]: (state, payload) => ({ ...state, userName: payload }),
    [types.SET_SIGNED_IN]: (state, payload) => ({ ...state, signedIn: payload }),
    [types.SET_ERROR_MESSAGE]: (state, payload) => ({ ...state, errorMessage: payload }),
    [types.SET_SERVER_CONNECTED]: (state, payload) => ({ ...state, serverConnected: payload })
});
