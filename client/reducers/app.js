import createReducer from '../utils/createReducer';
import {
    SET_APP_NAME
} from '../constants/action-types';

const initialState = {
    appName: 'Ubiquitous Spoon'
};

export default createReducer(initialState, {
    [SET_APP_NAME]: (state, payload) => ({ ...state, appName: payload })
});
