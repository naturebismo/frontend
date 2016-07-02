import Relay from 'react-relay';

export default class RegisterMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        me {
          id,
          username
        }
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{register}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RegisterPayload {
        user {
          id,
          username,
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      }
    }];
  }
  getVariables() {
    return {
      username: this.props.name,
      email: this.props.email,
      password: this.props.password,
    };
  }
}
