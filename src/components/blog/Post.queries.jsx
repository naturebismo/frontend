import Relay from 'react-relay';

export default {
  post: () => Relay.QL`
    query {
      postByUrl(url: $postURL)
    }
  `,
  viewer: () => Relay.QL`query { viewer }`
}