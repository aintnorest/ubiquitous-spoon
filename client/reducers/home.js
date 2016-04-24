import createReducer from '../utils/createReducer';
import {
    SET_HOME_TITLE
} from '../constants/action-types';

const initialState = {
    homeTitle: 'Home Screen'
};

export default createReducer(initialState, {
    [SET_HOME_TITLE]: (state, payload) => ({ ...state, SET_HOME_TITLE: payload })
});
