import Relay from 'react-relay';

export default class ProfileChangeAvatarMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{meProfileChangeAvatar}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ProfileChangeAvatarPayload {
        viewer {
          id,
          me {
            id,
            username,
            isAuthenticated
            avatar
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
            fragment on ProfileChangeAvatarPayload {
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
    return {};
  }

  getFiles() {
    return {
      avatar: this.props.file,
    };
  }
}
