import React from 'react';
import Relay from 'react-relay';
import PostDeleteMutation from './PostDelete.mutation'

class PostDelete extends React.Component {
  handleClick = (e) => {
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
    return (<a href="#" onClick={this.handleClick}>excluir</a>);
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
      }
    `,
  },
});
