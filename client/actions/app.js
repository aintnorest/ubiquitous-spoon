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
            dispatch(setErrorMessage(null));
            dispatch(setSignedIn(true));
            dispatch(redirect('/foo'));
        }).catch((e) => {
            dispatch(setErrorMessage(e.reason));
            dispatch(setSignedIn(false));
        });
    };
}

export function signOut() {
    return (dispatch) => {
        if (socketProxy) {
            socketProxy.disconnect();
        }
        dispatch(setUserName(null));
        dispatch(setSignedIn(false));
        dispatch(redirect('/'));
    };
}

export function redirect(route) {
    return push(route);
}

export function setUserName(userName) {
    return {
       type: types.SET_USER_NAME,
       payload: userName
    };
}

export function setSignedIn(signedIn) {
    return {
        type: types.SET_SIGNED_IN,
        payload: signedIn
    };
}

export function setErrorMessage(message) {
    return {
        type: types.SET_ERROR_MESSAGE,
        payload: message
    }
}
