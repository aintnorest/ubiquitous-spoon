import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/canvas';

function Canvas({ height, width }) {
    return (
        <div style={{
            width: width,
            height: height,
            background: 'red'
        }}>
            This is the Canvas!
        </div>
    );
}

export default connect(
    (state) => state.canvasReducer,
    (dispatch) => bindActionCreators(actions, dispatch)
)(Canvas);
