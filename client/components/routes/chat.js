import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/chat';
import InputField from '../inputField';

const Chat = React.createClass({
    atBottom: true,
    msgCache: [],
    componentWillMount: function() {
        this.props.listenForMessages();
    },
    checkKey(e) {
        if(e.charCode === 13 && this.props.message.length > 0) this.props.sendMessage();
    },
    componentWillUpdate() {
        if(this.refs.chatWindow != undefined) {
            let cw = this.refs.chatWindow;
            this.atBottom = cw.scrollHeight - cw.clientHeight <= cw.scrollTop + 1;
        }
    },
    componentDidUpdate() {
        if(this.refs.chatWindow != undefined) {
            let cw = this.refs.chatWindow;
            if(this.atBottom) cw.scrollTop = cw.scrollHeight - cw.clientHeight;
        }
    },

    render: function() {
        const {
            userName,
            message,
            messages,
            players,
            messageSending,
            messageError,
            setMessage,
            sendMessage
        } = this.props;

        let messagesList = [];
        if(messages.length === this.msgCache.length) messagesList = this.msgCache;
        else {
            this.msgCache = messagesList = messages.map((message) => {
                return (
                    <li key={message.id}>
                        {`${message.sender}: ${message.msg}`}
                    </li>
                );
            });
        }

        // show grayed out pending message
        if (messageSending) {
            messagesList.push((
                <li key={message} style={{color: 'gray'}}>
                    {`${userName}: ${message}`}
                </li>
            ));
        }

        const playersList = players.map((player) => {
            return (
                <li key={player}>{player}</li>
            );
        });

        return (
            <div className="body-Chat">
                <div className="chat-Body">
                    <h1>Chat</h1>
                    <ul ref='chatWindow'>
                        {messagesList}
                    </ul>
                    <InputField
                        type='text'
                        placeholder='message'
                        id='message'
                        error={messageError}
                        value={message}
                        onKeyPress={this.checkKey}
                        change={setMessage}
                        label='Message'
                    />
                    <button disabled={message.length === 0} className='signin-btn' onClick={sendMessage}>
                        Send
                    </button>
                </div>
                <div className="playerList-Body">
                    <h1>Players</h1>
                    <ul>
                        {playersList}
                    </ul>
                </div>
            </div>
        );
    }
});

export default connect(
    (state) => ({socketProxy: state.app.socketProxy, userName: state.app.userName, ...state.chat}),
    (dispatch) => bindActionCreators(actions, dispatch)
)(Chat);
