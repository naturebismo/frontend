import Relay from 'react-relay';

export default class PostCreateMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        }
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{postCreate}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on PostCreatePayload {
        post,
        viewer {
          allPosts,
        },
        errors {
          key,
          message,
        }
      }
    `;
  }
  getConfigs() {
    return [
      // {
      //   type: 'RANGE_ADD',
      //   parentName: 'viewer',
      //   parentID: this.props.viewer.id,
      //   connectionName: 'allPosts',
      //   edgeName: 'postEdge',
      //   rangeBehaviors: {
      //     '': 'prepend',
      //   },
      // },
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id,
        },
      }
    ];
  }
  getVariables() {
    return {
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
