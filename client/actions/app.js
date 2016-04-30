import { push } from 'react-router-redux'

import * as types from '../constants/action-types';
import SocketProxy from '../../server/tests/utils/clientSocketProxy';

const serverURL = 'http://localhost:4000';
let socketProxy;

export function signIn() {
    return (dispatch, getState) => {
        const socketConfig = {forceNew: false, multiplex: false};
        socketProxy = new SocketProxy(serverURL, socketConfig);
        const userName = getState().appReducer.userName;
        return socketProxy.signIn(userName).then(() => {
            dispatch(redirect('/foo'));
        }).catch((e) => {
            console.log(`Error logging in: ${JSON.stringify(e)}`);
        });
    };
}

export function setUserName(userName) {
    return {
       type: types.SET_USER_NAME,
       payload: userName
    };
}

export function redirect(route) {
    return push(route);
}
