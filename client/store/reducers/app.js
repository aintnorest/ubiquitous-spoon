import createReducer from '../../utils/createReducer';
import {SET_USER_NAME, SET_SIGNED_IN, SET_ERROR_MESSAGE} from '../../constants/action-types';

const initialState = {
    userName: null,
    signedIn: false,
    errorMessage: null
};

export default createReducer(initialState, {
    [SET_USER_NAME]: (state, payload) => ({ ...state, userName: payload }),
    [SET_SIGNED_IN]: (state, payload) => ({ ...state, signedIn: payload }),
    [SET_ERROR_MESSAGE]: (state, payload) => ({ ...state, errorMessage: payload })
});
