import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/home';

function Home({ homeTitle, setHomeTitle }) {
    return (
        <div>
            Home Title:
            <h3>{homeTitle}</h3>
            <br />
            <input type="text"
                value={homeTitle}
                onChange={(event) => setHomeTitle(event.target.value)}
            />
        </div>
    );
}

export default connect(
    (state) => state.homeReducer,
    (dispatch) => bindActionCreators(actions, dispatch)
)(Home);
