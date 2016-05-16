import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import * as actions from '../../actions/app';
import { Link, browserHistory } from 'react-router'
import Ah from '../appHeader';

function App({children}) {

    return (
        <div className='pageWrap'>
            <Ah />
            {children}
        </div>
    );
}

export default connect(
    (state) => state.app,
)(App);
