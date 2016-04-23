import * as types from '../constants/action-types';

export function setAppName(appName) {
    return {
       type: types.SET_APP_NAME,
       payload: appName
    };
}
