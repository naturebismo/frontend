import React from 'react';
import Relay from 'react-relay';
import { Modal, Alert } from "react-bootstrap";

import Register from './Register';
import Authenticate from './Authenticate';


class LoginRequired extends React.Component {
  state = {showModal: false, showMessage: false}

  openLoginModal = (e) => {
    e.preventDefault();
    this.setState({showModal: true});
  }

  closeLoginModal = () => {
    this.setState({showModal: false});
  }

  commitUpdate = (mutation, callbacks) => {
    if(this.props.viewer.me === null || this.props.viewer.me.isAuthenticated === false) {
      this.setState({showModal: true});
    } else {
      Relay.Store.commitUpdate(mutation, callbacks);
    }
  }

  componentWillMount() {
    if(typeof this.props.showMessage !== 'undefined') {
      this.setState({showMessage: this.props.showMessage});
    }

    if(typeof this.props.showModal !== 'undefined') {
      this.setState({showModal: this.props.showModal});
    }
  }

  componentWillReceiveProps(nextProps) {
    if(typeof nextProps.showMessage !== 'undefined') {
      this.setState({showMessage: this.props.showMessage});
    }

    if(typeof nextProps.showModal !== 'undefined') {
      this.setState({showModal: this.props.showModal});
    }
  }

  render() {
    var modalLogin = null;
    var message = null;

    if(this.state.showModal) {
      if(this.state.showMessage) {
        message = (<Alert bsStyle="danger">Você precisa estar autenticado para executar essa ação</Alert>);
      }

      modalLogin = (
        <Modal show={this.state.showModal} onHide={this.closeLoginModal}>
          <Modal.Header closeButton>
            <Modal.Title>Entrar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message}
            <Authenticate viewer={this.props.viewer} callback={this.closeLoginModal} />
            <legend>Criar uma conta</legend>
            <Register viewer={this.props.viewer} callback={this.closeLoginModal} />
          </Modal.Body>
        </Modal>
      );
    }

    return modalLogin;
  }
}

export default Relay.createContainer(LoginRequired, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          id,
          isAuthenticated
        },
        ${Register.getFragment('viewer')},
        ${Authenticate.getFragment('viewer')},
      }
    `,
  },
});
