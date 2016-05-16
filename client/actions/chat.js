import {ADD_MESSAGE, SET_MESSAGE, SET_MESSAGE_SENDING, SET_MESSAGE_ERROR} from '../constants/action-types';


export function listenForMessages () {
    return (dispatch, getState) => {
        const socketProxy = getState().app.socketProxy;
        socketProxy.listenToRoom((messageObject) => {
            dispatch({
                type: ADD_MESSAGE,
                payload: messageObject
            });
        });
    };
}

export function sendMessage () {
    return (dispatch, getState) => {
        const socketProxy = getState().app.socketProxy;
        const message = getState().chat.message;
        dispatch({
            type: SET_MESSAGE_SENDING,
            payload: true
        });
        socketProxy.messageToRoom(message).then((messageConfirmation) => {
            dispatch({
                type: SET_MESSAGE_SENDING,
                payload: false
            });
            dispatch({
                type: ADD_MESSAGE,
                payload: messageConfirmation
            });
            console.log('Got message Confirmation: ' + JSON.stringify(messageConfirmation));
        }).catch(function(messageConfirmation) {
            dispatch({
                type: SET_MESSAGE_SENDING,
                payload: false
            });
            dispatch({
                type: SET_MESSAGE_ERROR,
                payload: messageConfirmation
            });
            console.log('Never got message Confirmation: ' + JSON.stringify(messageConfirmation));
        });
    };
}

export function setMessage(e) {
    let message;
    if (e.target) message = e.target.value;
    else message = e;
    return {
       type: SET_MESSAGE,
       payload: message
    };
}
