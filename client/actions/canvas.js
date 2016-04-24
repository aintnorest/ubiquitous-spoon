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

export function onModelSelect() {
    return {
       type: types.ON_MODEL_SELECT
    };
}
