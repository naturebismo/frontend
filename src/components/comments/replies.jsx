import React from 'react';
import Relay from 'react-relay';
import { Media } from "react-bootstrap";

import CommentItem from './item';

class CommentsReplies extends React.Component {
  render() {
    var parent = this.props.parent;
    var viewer = this.props.viewer;

    return (
      <div className="list-group-item">
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

export default Relay.createContainer(CommentsReplies, {
  fragments: {
    parent: () => Relay.QL`
      fragment on Comment {
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
