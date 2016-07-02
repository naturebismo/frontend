import Relay from 'react-relay';

export default class PostDeleteMutation extends Relay.Mutation {
  static fragments = {
    post: () => Relay.QL`
      fragment on Post {
        id,
        url,
      }
    `,
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
    return Relay.QL`mutation{postDelete}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on PostDeletePayload {
        postDeletedID,
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
      //   type: 'NODE_DELETE',
      //   parentName: 'viewer',
      //   parentID: this.props.viewer.id,
      //   connectionName: 'allPosts',
      //   deletedIDFieldName: 'postDeletedID',
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
      id: this.props.post.id,
    };
  }
}
