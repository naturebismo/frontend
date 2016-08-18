import Relay from 'react-relay';

export default {
  revision: () => Relay.QL`
    query {
      revision(id: $revisionID)
    }
  `,
  viewer: () => Relay.QL`query { viewer }`
}
