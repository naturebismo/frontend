import 'babel-polyfill';

import "./assets/bootstrap-3.3.6/css/bootstrap.css";
import "./assets/font-awesome-4.6.1/css/font-awesome.min.css";
import "./assets/css/naturebismo.css";

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import useRelay from 'react-router-relay';
import { useRouterHistory, match, Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import IsomorphicRelay from 'isomorphic-relay';
import IsomorphicRouter from 'isomorphic-relay-router';
import injectNetworkLayer from './components/injectNetworkLayer';

Relay.injectNetworkLayer(injectNetworkLayer('/graphql'));
const environment = Relay.Store;

const appHistory = useRouterHistory(createBrowserHistory)();
const rootElement = document.getElementById('root');

const preloadedData = document.getElementById('preloadedData');
if(preloadedData !== null) {
	const data = JSON.parse(preloadedData.textContent);
	IsomorphicRelay.injectPreparedData(environment, data);
}

match({ routes, history: appHistory }, (error, redirectLocation, renderProps) => {
  IsomorphicRouter.prepareInitialRender(environment, renderProps).then(props => {
    ReactDOM.render(<Router {...props} />, rootElement);
  });
});