import React from 'react';
import Relay from 'react-relay';
import { Modal } from "react-bootstrap";

import CommentDeleteMutation from './CommentDelete.mutation';
import ConfirmDelete from '../nodes/confirmDelete';

class CommentDelete extends React.Component {
  state = {}

  handleDelete = (e) => {
    e.preventDefault();

    Relay.Store.commitUpdate(
      new CommentDeleteMutation({
          commenting: this.props.commenting,
          comment: this.props.comment,
      }),
      {
        onSuccess: (response) => {
          this.refs.confirmDelete.refs.component.closeModal();
        },
      }
    );
  }

  render() {
    return (<ConfirmDelete viewer={this.props.viewer}
                           handleDelete={this.handleDelete}
                           ref="confirmDelete" />);
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
        id,
        ${ConfirmDelete.getFragment('viewer')},
      }
    `,
  },
});
