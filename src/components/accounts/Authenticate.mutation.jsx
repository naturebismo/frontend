import Relay from 'react-relay';

export default class AuthenticateMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{authenticate}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AuthenticatePayload {
        viewer {
          id,
          me {
            id,
            username,
            isAuthenticated
          }
        }
      }
    `;
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id,
        }
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on AuthenticatePayload {
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
      username: this.props.email,
      password: this.props.password,
    };
  }
}
