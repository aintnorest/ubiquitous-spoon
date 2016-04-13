import * as types from '../constants/action-types';

export function setAppName(appName) {
    console.log('app name ' + appName);
    return {
       type: types.SET_APP_NAME,
       appName
    };
}
