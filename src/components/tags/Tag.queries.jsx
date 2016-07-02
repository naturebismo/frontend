import Relay from 'react-relay';

var TagSlugQueries = {
  tag: () => Relay.QL`
    query {
      tagBySlug(slug: $tagSlug)
    }
  `,
  viewer: () => Relay.QL`query { viewer }`
}

var TagIDQueries = {
  tag: () => Relay.QL`
    query {
      tag(id: $tagID)
    }
  `,
  viewer: () => Relay.QL`query { viewer }`
}


export {TagSlugQueries, TagIDQueries};