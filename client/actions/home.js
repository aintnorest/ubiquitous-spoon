import * as types from '../constants/action-types';

export function setHomeTitle(title) {
    return {
       type: types.SET_HOME_TITLE,
       payload: title
    };
}
