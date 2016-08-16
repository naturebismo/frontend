import Relay from 'react-relay';

export default class CommentEditMutation extends Relay.Mutation {
  static fragments = {
    comment: () => Relay.QL`
      fragment on Comment {
        id
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          username
        }
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{commentEdit}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CommentEditPayload {
        comment {
          id,
          body,
          commenting {
            count
          },
          document {
            revisionsCount
          },
          revisionCreated {
              author {
                  username
              }
          }
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {comment: this.props.comment.id},
      },
    ];
  }
  getVariables() {
    return {
      body: this.props.body,
      id: this.props.comment.id,
    };
  }
  getOptimisticResponse() {
    return {
      comment: {
        body: this.props.body,
      },
    };
  }
}
