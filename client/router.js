import React from 'react';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import * as R from './components/routes';
//ROUTES
export default function({store, DevTools}) {
    function requireAuth(nextState, replace) {
        if(store.getState().app.game === null) {
            replace({
                pathname: '/',
                state: { nextPathname: nextState.location.pathname }
            });
        }
    }
    //
    return(
        <Provider store={store}>
            <div className='pageWrap'>
                <Router history={syncHistoryWithStore(browserHistory, store)}>
                    <Route path="/" component={R.App}>
                        <IndexRoute component={R.Home}/>
                        <Route path="gameSpace" component={R.GameSpace} onEnter={requireAuth}/>
                        <Route path="chat" component={R.Chat} onEnter={requireAuth}/>
                    </Route>
                </Router>
                { DevTools ? <DevTools /> : null }
            </div>
        </Provider>
    );
}
