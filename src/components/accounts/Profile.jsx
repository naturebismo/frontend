import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {FormattedMessage} from 'react-intl';

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const ProfileDate = injectIntl(({date, intl}) => (
    <span title={intl.formatDate(date)}>
        <FormattedRelative value={date}/>
    </span>
));

class Profile extends React.Component {
  render() {
    var user = this.props.user;
    
    return (
      <div className="profile-component">
        <Helmet
          title={user.username}
        />

        <div className="page-header" style={{marginTop: 0}}>
            <h1 style={{marginTop: 0}}>{user.username}</h1>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Profile, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        username
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          username
          isAuthenticated
        },
      }
    `,
  },
});
