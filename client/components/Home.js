import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/app';

function Home({ appName, setAppName }) {
    return (
        <div>
            App Name:
            <h3>{appName}</h3>
            <br />
            <input type="text"
                value={appName}
                onChange={(event) => setAppName(event.target.value)}
            />
        </div>
    );
}

export default connect(
    (state) => state.appReducer,
    (dispatch) => bindActionCreators(actions, dispatch)
)(Home);
