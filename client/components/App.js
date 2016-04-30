import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/app';
import { Link, browserHistory } from 'react-router'

function App(props) {
    const {
        userName,
        signedIn,
        setUserName,
        signIn,
        signOut,
        errorMessage,
        children
    } = props;

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
                    <button onClick={()=>signOut()}>Sign out</button> :
                    <button onClick={()=>signIn()}>Sign in</button>
                }
            </div>
            <div style={{ marginTop: '1.5em' }}>{children}</div>
        </div>
    );
}

export default connect(
    (state) => state.appReducer,
        (dispatch) => bindActionCreators(actions, dispatch)
)(App);
