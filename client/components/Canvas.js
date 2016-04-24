import React from 'react';
import { Surface, Image, Group } from 'react-canvas';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/canvas';

// @TODO make this work with circle instead of rectangle
function collides(x1, y1, x2, y2, width, height) {
    return x1 >= x2 && x1 <= x2 + width && y1 >= y2 && y1 <= y2 + height;
}

function getCoordinates(e) {
    let x, y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= e.target.offsetLeft;
    y -= e.target.offsetTop;
    return { x, y };
}

function Canvas(props) {
    const {
        canvasHeight,
        canvasWidth,
        selected,
        modelX,
        modelY,
        onModelSelect,
        setModelCoordinates,
        setDragging,
        dragging
    } = props;

    const height = 100;
    const width = 100;

    function handleMouseUp(e) {
        if (dragging) setDragging(false);
    }

    function handleMouseMove(e) {
        if (!dragging) return;

        const { x, y } = getCoordinates(e);

        setModelCoordinates(x - width / 2, y - height / 2);
    }

    function handleMouseDown(e) {
        const { x, y } = getCoordinates(e);

        if (collides(x, y, modelX, modelY, width, height)) {
            setDragging(true);
        }

    }

    const groupStyle = {
      top: modelY,
      left: modelX,
      width: height,
      height: width
    };

    const imageStyle = {
      top: modelY,
      left: modelX,
      width: height,
      height: width
    };

    return (
        <div
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
        >
            <Surface
                width={canvasWidth}
                height={canvasHeight}
                left={0}
                top={0}
            >
                <Group style={groupStyle} onClick={onModelSelect}>
                    { selected ?
                        <Image style={imageStyle} src={require('../images/selection.png')} />
                        : null
                    }
                    <Image style={imageStyle} src={require('../images/model.png')} />
                </Group>
            </Surface>
        </div>
    );
}

export default connect(
    (state) => state.canvasReducer,
    (dispatch) => bindActionCreators(actions, dispatch)
)(Canvas);
