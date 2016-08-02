import Relay from 'react-relay';

export default {
  user: () => Relay.QL`
    query {
      userByUsername(username: $username)
    }
  `,
  viewer: () => Relay.QL`query { viewer }`
}