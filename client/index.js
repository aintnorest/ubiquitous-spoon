import React from 'react';
import ReactDOM from 'react-dom';
//
import initializeStore from './store';
import initializeRouter from './router';
//
import './css/main.css';
//
ReactDOM.render(
    initializeRouter(initializeStore(__NODE_ENV__)),
    document.getElementById('app')
);
