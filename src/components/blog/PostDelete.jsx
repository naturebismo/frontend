import React from 'react';
import Relay from 'react-relay';

import PostDeleteMutation from './PostDelete.mutation';
import ConfirmDelete from '../nodes/confirmDelete';

class PostDelete extends React.Component {
  state = {}

  handleDelete = (e) => {
    e.preventDefault();

    Relay.Store.commitUpdate(
      new PostDeleteMutation({
          post: this.props.post,
          viewer: this.props.viewer,
      }),
      {
        onSuccess: (response) => {
          this.context.router.push('/');
        },
      }
    );
  }

  render() {
    return (<ConfirmDelete viewer={this.props.viewer} handleDelete={this.handleDelete} />);
  }
}

PostDelete.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Relay.createContainer(PostDelete, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        ${PostDeleteMutation.getFragment('post')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        ${PostDeleteMutation.getFragment('viewer')},
        ${ConfirmDelete.getFragment('viewer')},
      }
    `,
  },
});
