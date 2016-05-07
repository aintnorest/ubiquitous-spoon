import { push } from 'react-router-redux'

import * as types from '../constants/action-types';
import SocketProxy from '../../server/tests/utils/clientSocketProxy';

const serverURL = 'ws://localhost:4000';
let socketProxy;

// Thunks

export function connectToServer() {
    return (dispatch) => {
        socketProxy = new SocketProxy(serverURL);
        socketProxy.ws.onopen = () => dispatch(setServerConnected(true));
        socketProxy.ws.onclose = () => dispatch(setServerConnected(false));
    };
}

export function signIn() {
    return (dispatch, getState) => {
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

// Normal actions

export function redirect(route) {
    return push(route);
}

export function setServerConnected(connected) {
    return {
        type: types.SET_SERVER_CONNECTED,
        payload: connected
    };
};

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
