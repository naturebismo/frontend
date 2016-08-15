import React from 'react';
import Relay from 'react-relay';
import { Modal } from "react-bootstrap";

import CommentDeleteMutation from './CommentDelete.mutation';
import LoginRequired from '../accounts/LoginRequired';

class CommentDelete extends React.Component {
  state = {showModal: false}

  openModal = (e) => {
    e.preventDefault();
    this.setState({showModal: true});
  }

  closeModal = () => {
    this.setState({showModal: false});
  }

  handleClick = (e) => {
    e.preventDefault();

    this.refs.loginRequired.refs.component.commitUpdate(
      new CommentDeleteMutation({
          commenting: this.props.commenting,
          comment: this.props.comment,
      }),
      {
        onSuccess: (response) => {
          this.closeModal();
        },
      }
    );
  }

  handleAskConfirmation = (e) => {

  }

  render() {

    var confirmation;
    if(this.state.showModal) {
      confirmation = (<Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Você tem certeza que deseja excluir?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <button className="btn btn-primary"
                    onClick={this.handleClick}>
              Sim, excluir
            </button> <button
                    className="btn btn-danger"
                    onClick={this.closeModal}>
              Não
            </button>
          </Modal.Body>
        </Modal>);
    }

    return (<span>
      <button className="btn btn-link" onClick={this.openModal}>
        <i className="fa fa-trash" aria-hidden="true"></i> excluir
      </button>

      {confirmation}

      <LoginRequired viewer={this.props.viewer} ref="loginRequired" showMessage={true} />
    </span>);
  }
}

export default Relay.createContainer(CommentDelete, {
  fragments: {
    comment: () => Relay.QL`
      fragment on Comment {
        ${CommentDeleteMutation.getFragment('comment')},
      }
    `,
    commenting: () => Relay.QL`
      fragment on Commenting {
        ${CommentDeleteMutation.getFragment('commenting')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
  },
});
