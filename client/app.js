import React from 'react';
import ReactDom from 'react-dom';
import {Router,match,browserHistory} from 'react-router';
import routes from './config/routes';
import RootStore from './config/stores';
import './config/axios';
import './app.scss';

const initialStore = window.__INITIAL_STATE__|| {};
RootStore.appState.initStore = initialStore;

match({history: browserHistory, routes}, (error, redirectLocation, renderProps) => {
    ReactDom.render(
        <Router {...renderProps}/>,
        document.getElementById('root')
    )
});
