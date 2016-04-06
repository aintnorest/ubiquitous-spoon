import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';

import createStore from './store';
import routes from './routes';

const store = createStore();

// for development convenience
window.store = store;


const appContainer = document.getElementById('app');


const renderApp = routes => {
	render(
		<Provider store={store}>
			<ReduxRouter>
				{routes}
			</ReduxRouter>
		</Provider>,
		appContainer
	);
};

renderApp(routes);