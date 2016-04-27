// import P2P from 'socket.io-p2p';
// import io from 'socket.io-client';

import * as types from '../constants/action-types';
import SocketProxy from '../../server/tests/utils/clientSocketProxy';

const serverURL = 'http://localhost:4000';
let socketProxy;

export function signIn() {
    return (dispatch, getState) => {
        let userName = getState().appReducer.userName;
        let socketConfig = {forceNew: false, multiplex: false};
        socketProxy = new SocketProxy(serverURL, socketConfig);
        socketProxy.signIn(userName).then(() => {
            // dispatch({type: types.ON_USER_SIGN_IN});
            console.log('signed in');
        }).catch((e) => {
            console.log(`Error logging in: ${JSON.stringify(e)}`);
        });
    };
}

export function setAppName(appName) {
    return {
       type: types.SET_APP_NAME,
       payload: appName
    };
}


