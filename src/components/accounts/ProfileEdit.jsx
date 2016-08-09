import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import ProfileChangePassword from './ProfileChangePassword';

class ProfileEdit extends React.Component {
  render() {
    var user = this.props.viewer.me;
    
    return (
      <div className="profile-component">
        <Helmet
          title={user.username}
        />

        <div className="page-header" style={{marginTop: 0}}>
            <h1 style={{marginTop: 0}}>{user.username}</h1>
        </div>

        <ProfileChangePassword viewer={this.props.viewer} />
      </div>
    );
  }
}

export default Relay.createContainer(ProfileEdit, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          username
          isAuthenticated
        },
        ${ProfileChangePassword.getFragment('viewer')},
      }
    `,
  },
});
