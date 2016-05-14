import React from 'react';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
//ROUTES

export default function({store, DevTools}) {

    return(
        <Provider store={store}>
            <div>
                <Router history={syncHistoryWithStore(browserHistory, store)}>
                    <Route path="/" component={App}>
                        <IndexRoute component={Home}/>
                        <Route path="canvas" component={Canvas}/>
                        <Route path="foo" component={Foo}/>
                        <Route path="bar" component={Bar}/>
                        <Route path="GameSpace" component={GameSpace}/>
                    </Route>
                </Router>
                { DevTools ? <DevTools /> : null }
            </div>
        </Provider>
    );
}
