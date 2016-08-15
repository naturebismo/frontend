import Relay from 'react-relay';

export default class CommentDeleteMutation extends Relay.Mutation {
  static fragments = {
    comment: () => Relay.QL`
      fragment on Comment {
        id
      }
    `,
    commenting: () => Relay.QL`
      fragment on Commenting {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{commentDelete}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CommentDeletePayload {
        commentDeletedID,
        commenting {
          id
          comments
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'NODE_DELETE',
        parentName: 'commenting',
        parentID: this.props.commenting.id,
        connectionName: 'comments',
        deletedIDFieldName: 'commentDeletedID',
      },
    ];
  }
  getVariables() {
    return {
      id: this.props.comment.id,
    };
  }
}
