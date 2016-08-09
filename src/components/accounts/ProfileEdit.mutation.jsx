import Relay from 'react-relay';

export default class RegisterMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{meProfileEdit}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ProfileEditPayload {
        viewer {
          id,
          me {
            id,
            username,
            firstName,
            email
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
            fragment on ProfileEditPayload {
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
      firstName: this.props.first_name,
      username: this.props.username,
      email: this.props.email
    };
  }
}
