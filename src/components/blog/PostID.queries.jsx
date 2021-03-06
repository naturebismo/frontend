import Relay from 'react-relay';

export default {
  post: () => Relay.QL`
    query {
      post(id: $postID)
    }
  `,
  viewer: () => Relay.QL`query { viewer }`
}
