import React from 'react';
import ReactDOM from 'react-dom';
//
import initializeStore from './store';
import initializeRouter from './router';
//
ReactDOM.render(
    initializeRouter(initializeStore(process.env.NODE_ENV)),
    document.getElementById('app')
);
