import Relay from 'react-relay';

export default class VoteDeleteMutation extends Relay.Mutation {
  static fragments = {
    voting: () => Relay.QL`
      fragment on Voting {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{voteDelete}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on VoteDeletePayload {
        voteDeletedID,
        voting {
          id,
          count,
          sumValues,
          mine {
            id
            value
          },
          votes
        }
      }
    `;
  }
  getConfigs() {
    return [
        {
        type: 'FIELDS_CHANGE',
        fieldIDs: {voting: this.props.voting.id},
      },
      {
        type: 'NODE_DELETE',
        parentName: 'voting',
        parentID: this.props.voting.id,
        connectionName: 'votes',
        deletedIDFieldName: 'voteDeletedID',
      }
    ];
  }
  getVariables() {
    return {
      id: this.props.vote.id,
    };
  }
}
