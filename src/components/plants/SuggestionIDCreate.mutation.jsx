import Relay from 'react-relay';

export default class SuggestionIDCreateMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
    whatIsThis: () => Relay.QL`
      fragment on WhatIsThis {
        id
      }
    `,
    lifeNode: () => Relay.QL`
      fragment on LifeNode {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{suggestionIDCreate}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on SuggestionIDCreatePayload {
        suggestionID {
          node {
            id
          }
        },
        whatIsThis {
          id
          suggestions
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'whatIsThis',
        parentID: this.props.whatIsThis.id,
        connectionName: 'suggestions',
        edgeName: 'suggestionID',
        rangeBehaviors: {
          '': 'prepend',
        },
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on SuggestionIDCreatePayload {
              errors {
                code,
                location
                message
              }
            }
          `,
        ]
      }
    ];
  }
  getVariables() {
    return {
      whatIsThis: this.props.whatIsThis.id,
      identification: this.props.lifeNode.id,
      notes: this.props.notes,
    };
  }
}
