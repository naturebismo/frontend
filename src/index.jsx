import 'babel-polyfill';

import "./assets/bootstrap-3.3.6/css/bootstrap.css";
import "./assets/font-awesome-4.6.1/css/font-awesome.min.css";
import "./assets/css/naturebismo.css";

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import useRelay from 'react-router-relay';
import { applyRouterMiddleware, useRouterHistory, match, Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import IsomorphicRouter from 'isomorphic-relay-router';
import injectNetworkLayer from './components/injectNetworkLayer';

const networkLayer = injectNetworkLayer();
Relay.injectNetworkLayer(networkLayer);
const environment = Relay.Store;

const appHistory = useRouterHistory(createBrowserHistory)();
const rootElement = document.getElementById('root');

match({ routes, history: appHistory}, (error, redirectLocation, renderProps) => {
	IsomorphicRouter.prepareInitialRender(environment, renderProps).then(props => {
		ReactDOM.render(<Router {...props} />, rootElement);
	})
});
