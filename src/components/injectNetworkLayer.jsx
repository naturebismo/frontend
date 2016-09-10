import Relay from 'react-relay';

export default function injectNetworkLayer(graphql_url, req) {
    var networkLayerConfig = {
        credentials: 'same-origin',
    };
    if(typeof red !== undefined){
        networkLayerConfig['headers'] = req.headers;
    }
    var networkLayer = new Relay.DefaultNetworkLayer(graphql_url, networkLayerConfig);
    return networkLayer;
};
