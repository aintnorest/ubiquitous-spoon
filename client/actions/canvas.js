import * as types from '../constants/action-types';

export function setCanvasWidth(canvasWidth) {
    return {
       type: types.SET_CANVAS_WIDTH,
       payload: canvasWidth
    };
}

export function setCanvasHeight(canvasHeight) {
    return {
       type: types.SET_CANVAS_HEIGHT,
       payload: canvasHeight
    };
}

export function setModelCoordinates(modelX, modelY) {
    return {
       type: types.SET_MODEL_COORDINATES,
       payload: { modelX, modelY }
    };
}

export function setDragging(dragging) {
    return {
       type: types.SET_DRAGGING,
       payload: dragging
    };
}

export function onModelSelect() {
    return {
       type: types.ON_MODEL_SELECT
    };
}
