import * as types from '../constants/action-types';

export function setWidth(width) {
    return {
       type: types.SET_WIDTH,
       payload: width
    };
}

export function setHeight(height) {
    return {
       type: types.SET_HEIGHT,
       payload: height
    };
}
