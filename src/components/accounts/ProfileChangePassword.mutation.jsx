import Relay from 'react-relay';

export default class ProfileChangePasswordMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{mePasswordChange}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on PasswordChangePayload {
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
            fragment on PasswordChangePayload {
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
      oldPassword: this.props.old_password,
      newPassword1: this.props.new_password1,
      newPassword2: this.props.new_password2,
    };
  }
}
