import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
//DEV TOOLS
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
//
export default function(env) {
    if(env === 'development') {
        //
        const DevTools = createDevTools(
            <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
                <LogMonitor theme="tomorrow" preserveScrollTop={false} />
            </DockMonitor>
        );
        //
        const reducer = combineReducers({
            ...reducers,
            routing: routerReducer
        });
        //
        const store = createStore(
          reducer,
          compose(
            applyMiddleware(thunk),
            applyMiddleware(routerMiddleware(browserHistory)),
            DevTools.instrument()
          )
        );

        return {store, DevTools};
    } else {
        let DevTools;
        //
        const reducer = combineReducers({
            ...reducers,
            routing: routerReducer
        });
        //
        const store = createStore(
          reducer,
          compose(
            applyMiddleware(thunk),
            applyMiddleware(routerMiddleware(browserHistory))
          )
        );

        return {store, DevTools};
    }
}
