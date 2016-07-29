import Relay from 'react-relay';

export default class VoteSetMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{voteSet}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on VoteSetPayload {
        parent {
          ... on Post {
            id,
            votes
          }

          ... on Comment {
            id,
            votes
          }
        }
        vote {
          id
          value
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
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {parent: this.props.parent.id},
      },
      // {
      //   type: 'FIELDS_CHANGE',
      //   fieldIDs: {vote: this.props.vote.id},
      // }
    ];
  }
  getVariables() {
    return {
      value: this.props.value,
      parent: this.props.parent.id,
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
