import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/app';
import { Link, browserHistory } from 'react-router'

const App = React.createClass({
    componentWillMount: function() {
        this.props.connectToServer();
    },

    render: function() {
        const {
            userName,
            signedIn,
            setUserName,
            signIn,
            signOut,
            errorMessage,
            serverConnected,
            children
        } = this.props;

        return (
            <div>
                <h1>{'Ubiquitous Spoon'}</h1>
                <header>
                    Links:
                    {' '}
                    <Link to='/'>Home</Link>
                    {' '}
                    <Link to='/canvas'>Canvas</Link>
                    {' '}
                    <Link to='/foo'>Foo</Link>
                    {' '}
                    <Link to='/bar'>Bar</Link>
                </header>
                {errorMessage ?
                    (<div style={{color: 'red'}}>
                        {errorMessage}
                    </div>) :
                    null
                }
                <div>
                    {signedIn ?
                        userName :
                        <input
                            type='text'
                            placeholder='User'
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        /> }
                    {signedIn ?
                        <button
                            disabled={!serverConnected}
                            onClick={()=>signOut()}>
                            Sign out
                        </button> :
                        <button
                            disabled={!serverConnected}
                            onClick={()=>signIn()}>
                            Sign in
                        </button>
                    }
                </div>
                <div style={{ marginTop: '1.5em' }}>{children}</div>
            </div>
        );
    }
});

export default connect(
    (state) => state.appReducer,
    (dispatch) => bindActionCreators(actions, dispatch)
)(App);
