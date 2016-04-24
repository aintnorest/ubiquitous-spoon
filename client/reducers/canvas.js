import createReducer from '../utils/createReducer';
import {
    SET_CANVAS_WIDTH,
    SET_CANVAS_HEIGHT,
    ON_MODEL_SELECT
} from '../constants/action-types';

const initialState = {
    canvasWidth: 500,
    canvasHeight: 500,
    selected: false
};

export default createReducer(initialState, {
    [SET_CANVAS_WIDTH]: (state, payload) => ({ ...state, canvasWidth: payload }),
    [SET_CANVAS_HEIGHT]: (state, payload) => ({ ...state, canvasHeight: payload }),
    [ON_MODEL_SELECT]: (state) => ({ ...state, selected: !state.selected })
});
