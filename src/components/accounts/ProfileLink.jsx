import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

class ProfileLink extends React.Component {
  render() {
    return (<Link to={`/u/${this.props.user.username}`}>{this.props.user.username}</Link>);
  }
}

export default Relay.createContainer(ProfileLink, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
      }
    `,
  },
});
