import Relay from 'react-relay';

export default class PostEditMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
      }
    `,
    post: () => Relay.QL`
      fragment on Post {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{postEdit}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on PostEditPayload {
        post,
        viewer {
          allPosts,
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id,
          post: this.props.post.id,
        },
      }
    ];
  }
  getVariables() {
    return {
      id: this.props.post.id,
      url: this.props.url,
      title: this.props.title,
      publishedAt: this.props.publishedAt,
      body: this.props.body,
      tags: this.props.tags,
    };
  }
  getOptimisticResponse() {
    return {
      post: {
        url: this.props.url,
        text: this.props.text,
        body: this.props.body,
        publishedAt: this.props.publishedAt,
      },
      viewer: {
        id: this.props.viewer.id,
      },
    };
  }
}
