import React from 'react';
import Relay from 'react-relay';
import { Modal } from "react-bootstrap";

class ConfirmDelete extends React.Component {
  state = {showModal: false}

  openModal = (e) => {
    e.preventDefault();
    this.setState({showModal: true});
  }

  closeModal = () => {
    this.setState({showModal: false});
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
                    onClick={this.props.handleDelete}>
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

      {this.props.children}
    </span>);
  }
}

export default Relay.createContainer(ConfirmDelete, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
  },
});
