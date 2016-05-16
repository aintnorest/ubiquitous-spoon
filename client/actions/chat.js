import {
    ADD_MESSAGE,
    SET_MESSAGE,
    SET_PLAYERS,
    SET_MESSAGE_SENDING,
    SET_MESSAGE_ERROR
} from '../constants/action-types';


export function listenForMessages () {
    return (dispatch, getState) => {
        const socketProxy = getState().app.socketProxy;
        const players = getState().app.players;
        dispatch(setPlayers(players));
        socketProxy.listenToRoom((messageObject) => {
            dispatch(addMessage(messageObject));
        });
        socketProxy.on('roomUpdate', ({userList}) => {
            dispatch(setPlayers(userList));
        });
    };
}

export function sendMessage () {
    return (dispatch, getState) => {
        const socketProxy = getState().app.socketProxy;
        const message = getState().chat.message;
        dispatch(setMessageSending(true));
        socketProxy.messageToRoom(message).then((messageConfirmation) => {
            dispatch({
               type: SET_MESSAGE,
               payload: ''
            });
            dispatch(setMessageSending(false));
            dispatch(addMessage(messageConfirmation));
            console.log('Got message Confirmation: ' + JSON.stringify(messageConfirmation));
        }).catch(function(messageConfirmation) {
            dispatch(setMessageSending(false));
            dispatch(setMessageError(messageConfirmation));
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

export function setMessageSending(sending) {
    return {
        type: SET_MESSAGE_SENDING,
        payload: sending
    };
}

export function setMessageError(error) {
    return {
        type: SET_MESSAGE_ERROR,
        payload: error
    };
}

export function setPlayers(players) {
    return {
        type: SET_PLAYERS,
        payload: players
    };
}

export function addMessage(message) {
    return {
        type: ADD_MESSAGE,
        payload: message
    };
}
