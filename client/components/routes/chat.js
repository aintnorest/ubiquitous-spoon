import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/chat';
import InputField from '../inputField';

const Chat = React.createClass({
    componentWillMount: function() {
        this.props.listenForMessages();
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

        const messagesList = messages.map((message) => {
            return (
                <li key={message.id}>
                    {`${message.sender}: ${message.msg}`}
                </li>
            );
        });

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
            <div>
                <div>
                    <h1>Chat</h1>
                    <ul>
                        {messagesList}
                    </ul>
                    <InputField
                        type='text'
                        placeholder='message'
                        id='message'
                        error={messageError}
                        value={message}
                        change={setMessage}
                        label='Message'
                    />
                    <button className='send-btn' onClick={sendMessage}>
                        Send
                    </button>
                </div>
                <div>
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
