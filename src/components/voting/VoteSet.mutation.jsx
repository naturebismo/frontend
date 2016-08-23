import Relay from 'react-relay';

export default class VoteSetMutation extends Relay.Mutation {
  static fragments = {
    voting: () => Relay.QL`
      fragment on Voting {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{voteSet}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on VoteSetPayload {
        voting {
          id,
          count,
          countUps,
          mine {
            id,
            value
          },
          votes
        }
        vote {
          id
          value
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
        type: 'RANGE_ADD',
        parentName: 'voting',
        parentID: this.props.voting.id,
        connectionName: 'votes',
        edgeName: 'vote',
        rangeBehaviors: {
          '': 'prepend',
        },
      }
    ];
  }
  getVariables() {
    return {
      value: this.props.value,
      parent: this.props.voting.id,
    };
  }
  getOptimisticResponse() {
    return {
      vote: {
        value: this.props.value,
      },
    };
  }
}
