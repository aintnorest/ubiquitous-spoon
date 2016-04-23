import createReducer from '../utils/createReducer';
import {
    SET_WIDTH,
    SET_HEIGHT
} from '../constants/action-types';

const initialState = {
    width: 500,
    height: 500
};

export default createReducer(initialState, {
    [SET_WIDTH]: (state, payload) => ({ ...state, width: payload }),
    [SET_HEIGHT]: (state, payload) => ({ ...state, height: payload })
});
