import Relay from 'react-relay';

const GRAPHQL_URL = '/graphql';

export default function injectNetworkLayer() {
    var networkLayer = new Relay.DefaultNetworkLayer(GRAPHQL_URL, {
        credentials: 'same-origin',
        // headers: {
        //   Authorization: 'Bearer ' + token
        // }
    });
   //  Relay.injectNetworkLayer(networkLayer);
    return networkLayer;
};
