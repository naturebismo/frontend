import React from 'react';
import Relay from 'react-relay';

class Logout extends React.Component {
  shouldComponentUpdate(){
    return true;
  }
  componentWillMount() {
    localStorage.removeItem("jwt_token");
    //this.context.router.push('/');
    window.location.pathname = "/";
  }

  render() {
    return null;
  }
}

Logout.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Logout;
