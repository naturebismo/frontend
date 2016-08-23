import Relay from 'react-relay';

export default class RevisionRevertMutation extends Relay.Mutation {
  static fragments = {
    revision: () => Relay.QL`
      fragment on Revision {
        id
      }
    `,
    node: () => Relay.QL`
      fragment on Node {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{revisionRevert}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RevisionRevertPayload {
        node {
          id
          __typename
        }
      }
    `;
  }
  getConfigs() {
    return [
      // {
      //   type: 'FIELDS_CHANGE',
      //   fieldIDs: {node: this.props.node.id},
      // },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on RevisionRevertPayload {
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
      id: this.props.revision.id,
    };
  }
}
