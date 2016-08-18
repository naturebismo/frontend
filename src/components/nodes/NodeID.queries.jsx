import Relay from 'react-relay';

var NodeIDQueries = {
  node: () => Relay.QL`
    query {
      node(id: $nodeID)
    }
  `,
  viewer: () => Relay.QL`query { viewer }`
}

var NodeRevisionIDQueries = {
  node: () => Relay.QL`
    query {
      nodeByRevisionId(id: $revisionID)
    }
  `,
  viewer: () => Relay.QL`query { viewer }`
}

export {NodeIDQueries, NodeRevisionIDQueries};