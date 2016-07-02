import Relay from 'react-relay';

export default class DeauthenticateMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation{deauthenticate}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeauthenticatePayload {
        viewer {
          id,
          me {
            isAuthenticated
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      }
    }];
  }

  getVariables() {
    return {};
  }
}
