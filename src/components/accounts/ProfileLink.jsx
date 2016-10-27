import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { OverlayTrigger, Popover } from "react-bootstrap";

class ProfileLink extends React.Component {
  render() {
    var user = this.props.user;
    var popover = (<Popover id={`profile_link_${user.id}`}>
      <div className="clearfix">
        <img src={user.avatar.url} width="40" className="pull-left" style={{marginRight: '10px'}} />
        <strong>{user.firstName}</strong><br/>
        Reputação: {user.reputation}
      </div>
    </Popover>);
    return (<OverlayTrigger placement="bottom" overlay={popover}>
      <Link to={`/u/${user.username}`}>{user.username}</Link>
    </OverlayTrigger>);
  }
}

export default Relay.createContainer(ProfileLink, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
        firstName
        reputation
        avatar(width: 40, height: 40) {
          url
        }
      }
    `,
  },
});
