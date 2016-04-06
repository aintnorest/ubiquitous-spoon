import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions/app';

const App = React.createClass({
	render() {
		return <div>App.jsx Content!</div>
	}
});

export default connect(
	(state) => state,
	(dispatch) => bindActionCreators(actions, dispatch)
)(App);
