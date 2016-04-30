import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import thunk from 'redux-thunk';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';

import * as reducers from './reducers';
import { App, Home, Foo, Bar, Canvas } from './components';

const DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
        <LogMonitor theme="tomorrow" preserveScrollTop={false} />
    </DockMonitor>
);

const reducer = combineReducers({
    ...reducers,
    routing: routerReducer
});

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(browserHistory)),
    DevTools.instrument()
  )
);

// for development convenience
window.store = store;

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <div>
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRoute component={Home}/>
                    <Route path="canvas" component={Canvas}/>
                    <Route path="foo" component={Foo}/>
                    <Route path="bar" component={Bar}/>
                </Route>
            </Router>
            <DevTools />
        </div>
    </Provider>,
    document.getElementById('app')
);
