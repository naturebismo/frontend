import Relay from 'react-relay';

export default function injectNetworkLayer(graphql_url) {
    var networkLayer = new Relay.DefaultNetworkLayer(graphql_url, {
        credentials: 'same-origin',
    });
    return networkLayer;
};
