import React from 'react';
import Relay from 'react-relay';
import { Media } from "react-bootstrap";

import CommentItem from './item';

class CommentsList extends React.Component {
  render() {
    var parent = this.props.parent;
    var viewer = this.props.viewer;

    return (
      <div>
        {parent.comments.edges.map(function(edge, i){
          var comment = edge.node;
          return (
            <CommentItem key={comment.id} viewer={viewer} comment={comment} />
          );
        })}
      </div>
    );
  }
}

export default Relay.createContainer(CommentsList, {
  fragments: {
    parent: () => Relay.QL`
      fragment on Post {
        comments(first: 50) {
          edges {
            node {
              id,
              ${CommentItem.getFragment('comment')},
            }
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${CommentItem.getFragment('viewer')},
      }
    `,
  },
});
