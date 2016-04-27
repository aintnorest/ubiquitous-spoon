import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/app';
import { Link, browserHistory } from 'react-router'

function App({ appName, signIn, children }) {
    return (
        <div>
            <h1>{appName}</h1>
            <header>
                Links:
                {' '}
                <Link to="/">Home</Link>
                {' '}
                <Link to="/canvas">Canvas</Link>
                {' '}
                <Link to="/foo">Foo</Link>
                {' '}
                <Link to="/bar">Bar</Link>
            </header>
            <div>
                <button onClick={()=>signIn()}>Sign in</button>
            </div>
            <div style={{ marginTop: '1.5em' }}>{children}</div>
        </div>
    );
}

export default connect(
    (state) => state.appReducer,
    (dispatch) => bindActionCreators(actions, dispatch)
)(App);
