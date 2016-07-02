import Relay from 'react-relay';

var PostIDQueries = {
  post: () => Relay.QL`
    query {
      post(id: $postID)
    }
  `,
  viewer: () => Relay.QL`query { viewer }`
}

var PostRevisionIDQueries = {
  post: () => Relay.QL`
    query {
      postByRevisionId(id: $revisionID)
    }
  `,
  viewer: () => Relay.QL`query { viewer }`
}

export {PostIDQueries, PostRevisionIDQueries};