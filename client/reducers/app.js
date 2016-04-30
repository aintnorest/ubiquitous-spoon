import createReducer from '../utils/createReducer';
import * as types from '../constants/action-types';

const initialState = {
    userName: null
};

export default createReducer(initialState, {
    [types.SET_USER_NAME]: (state, payload) => ({ ...state, userName: payload })
});
