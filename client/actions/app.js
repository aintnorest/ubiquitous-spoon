import { push } from 'react-router-redux';
import {SET_GAME, SET_LOADING, SET_USER_NAME, SET_SIGNED_IN, SET_ERROR_MESSAGE, SET_SERVER_CONNECTED, SET_SOCKETPROXY} from '../constants/action-types';
import loadScript from '../utils/loadScript';
import PIXI from 'pixi.js';
import SocketProxy from '../../server/tests/utils/clientSocketProxy';
//
const serverURL = 'ws://localhost:4000';
//
export function connectToServer() {
    return (dispatch) => {
        let socketProxy = new SocketProxy(serverURL);
        dispatch({type:SET_SOCKETPROXY, payload:socketProxy});
        socketProxy.onWSopen = () => dispatch(setServerConnected(true));
        socketProxy.onWSclose = () => dispatch(setServerConnected(false));
    };
}
//
export function setServerConnected(connected) {
    return {
        type: SET_SERVER_CONNECTED,
        payload: connected
    };
};
//
export function signIn() {
    return (dispatch, getState) => {
        const s = getState().app;
        return s.socketProxy.signIn(s.userName,s.game).then(() => {
            dispatch(setErrorMessage(null));
            dispatch(setSignedIn(true));
        }).catch((e) => {
            console.log('error on signin: ',e);
            dispatch(setErrorMessage(e.reason));
            dispatch(setSignedIn(false));
        });
    };
}
//
export function setGame(game) {
    return (dispatch, getState) => {
        let loadProgressHandler = function(loader, resource) {
            dispatch({type: SET_LOADING, payload:{
                type:resource.url, progress:loader.progress
            }});
        };
        dispatch({type: SET_LOADING, payload:{
            type:'Game Data', progress:0
        }});
        loadScript('static/'+game+'/index.js').then(function(d) {
            Object.keys(gameFunctions).forEach(function(key) {
                gameFunctions[key].sprites.forEach(function(url) {
                    dispatch({type: SET_LOADING, payload:{
                        type:url, progress:0
                    }});
                    PIXI.loader.add(url).on("progress", loadProgressHandler);
                });
            });
            PIXI.loader.load(function() {
                dispatch({
                   type: SET_GAME,
                   payload: game
                });
            });
            dispatch({type: SET_LOADING, payload:{
                type:'Game Data', progress:100
            }});
        }).catch(function(err) {
            dispatch({type: SET_LOADING, payload:{
                type:'Game Data', progress:-1
            }});
        });
    };
}

export function signOut() {
    return (dispatch, getState) => {
        const s = getState().app;
        if (s.socketProxy) {
            s.socketProxy.disconnect();
        }
        dispatch(setUserName(''));
        dispatch(setSignedIn(false));
        dispatch(push('/'));
        dispatch(connectToServer());
    };
}

export function setUserName(e) {
    let userName;
    if(e.target) userName = e.target.value;
    else userName = e;
    return {
       type: SET_USER_NAME,
       payload: userName
    };
}

export function setSignedIn(signedIn) {
    return {
        type: SET_SIGNED_IN,
        payload: signedIn
    };
}

export function setErrorMessage(message) {
    return {
        type: SET_ERROR_MESSAGE,
        payload: message
    }
}
