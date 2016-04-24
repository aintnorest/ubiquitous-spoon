import createReducer from '../utils/createReducer';
import * as types from '../constants/action-types';

const initialState = {
    canvasWidth: 500,
    canvasHeight: 500,
    modelX: 0,
    modelY: 0,
    selected: false,
    dragging: false
};

export default createReducer(initialState, {
    [types.SET_CANVAS_WIDTH]: (state, payload) => ({ ...state, canvasWidth: payload }),
    [types.SET_CANVAS_HEIGHT]: (state, payload) => ({ ...state, canvasHeight: payload }),
    [types.SET_MODEL_COORDINATES]: (state, payload) => ({ ...state, modelX: payload.modelX, modelY: payload.modelY }),
    [types.SET_DRAGGING]: (state, payload) => ({ ...state, dragging: !state.dragging }),
    [types.ON_MODEL_SELECT]: (state, payload) => ({ ...state, selected: !state.selected })
});
