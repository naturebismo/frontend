import Relay from 'react-relay';

export default class VoteDeleteMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{voteDelete}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on VoteDeletePayload {
        voteDeletedID,
        parent {
          ... on Post {
            id
            votes
          }

          ... on Comment {
            id
            votes
          }
        }
        errors {
          key,
          message,
        }
      }
    `;
  }
  getConfigs() {
    return [
        {
          type: 'NODE_DELETE',
          parentName: 'parent',
          parentID: this.props.parent.id,
          connectionName: 'votes',
          deletedIDFieldName: 'voteDeletedID',
        },
        {
          type: 'FIELDS_CHANGE',
          fieldIDs: {
            parent: this.props.parent.id,
          },
        }
    ];
  }
  getVariables() {
    return {
      id: this.props.vote.id,
    };
  }
}
