import React from 'react';
import { Surface, Image, Text } from 'react-canvas';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/canvas';

function Canvas(props) {
    const {
        canvasHeight,
        canvasWidth
    } = props;


    const imageStyle = {
      top: 0,
      left: 0,
      width: 100,
      height: 100
    };

    return (
        <div>
            <p>Below is the canvas</p>
            <Surface
                width={canvasWidth}
                height={canvasHeight}
                left={500}
                top={500}
            >
                <Image style={imageStyle} src={require('../images/model.png')} />
            </Surface>
        </div>
    );
}

export default connect(
    (state) => state.canvasReducer,
    (dispatch) => bindActionCreators(actions, dispatch)
)(Canvas);
