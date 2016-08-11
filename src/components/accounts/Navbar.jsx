import React from 'react';
import Relay from 'react-relay';
import { Nav, Navbar, NavDropdown, MenuItem, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import LoginRequired from './LoginRequired';
import DeauthenticateMutation from './Deauthenticate.mutation';


class AccountNavbar extends React.Component {
  state = {}

  openLoginModal = (e) => {
    this.refs.loginRequired.refs.component.openLoginModal(e);
  }

  handleLogout = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new DeauthenticateMutation({
          viewer: this.props.viewer}),
    );
  }

  render() {
    if(this.props.viewer.me !== null && this.props.viewer.me.isAuthenticated === true) {
      var navBarUser = (
        <Nav pullRight>
          <NavDropdown title={this.props.viewer.me.username} id="header-nav-dropdown">
            <LinkContainer to={`/u/${this.props.viewer.me.username}`}><MenuItem>Meu perfil</MenuItem></LinkContainer>
            <LinkContainer to={`/blog/new`}><MenuItem>Escrever</MenuItem></LinkContainer>
            <LinkContainer to={`/me/edit`}><MenuItem>Editar perfil</MenuItem></LinkContainer>
            <MenuItem divider />
            <MenuItem onClick={this.handleLogout}>Sair</MenuItem>
          </NavDropdown>
        </Nav>
      );
    } else {
      var navBarUser = (
        <Navbar.Text className="navbar-text" pullRight>
          Quer participar? <a href="" onClick={this.openLoginModal}>Entre ou registre-se</a> em segundos.
          <LoginRequired viewer={this.props.viewer} ref="loginRequired" />
        </Navbar.Text>
      );
    }

    return navBarUser;
  }
}

export default Relay.createContainer(AccountNavbar, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          id,
          username,
          isAuthenticated
        },
        ${LoginRequired.getFragment('viewer')},
        ${DeauthenticateMutation.getFragment('viewer')},
      }
    `,
  },
});
