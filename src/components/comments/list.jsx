import React from 'react';
import Relay from 'react-relay';
import { Media } from "react-bootstrap";

import CommentItem from './item';
import CommentCreate from '../comments/add';

class CommentsList extends React.Component {
  render() {
    var commenting = this.props.commenting;
    var comments = commenting.comments;
    var viewer = this.props.viewer;

    var repliesCount;
    if(commenting.count >= 1) {
      if(typeof this.props.handleToggleReplies === 'function'){
        repliesCount = (<button className="list-group-item list-group-item-info comments-toggle-replies" onClick={this.props.handleToggleReplies}>{comments.count} respostas</button>);
      } else {
        repliesCount = (<div className="list-group-item list-group-item-info comments-toggle-replies">{commenting.count} respostas</div>);
      }
    }

    // var comments_rendered;
    // if(this.props.relay.variables.expanded) {
    var comments_rendered = comments.edges.map(function(edge, i){
        var comment = edge.node;
        return (
          <CommentItem key={comment.id}
                       viewer={viewer}
                       comment={comment}
                       commenting={commenting} />
        );
      });
    // }

    var replyForm = (<CommentCreate viewer={this.props.viewer} commenting={this.props.commenting} />);

    return (
      <div className="list-group comments-list">
        {replyForm}
        {repliesCount}
        {comments_rendered}
      </div>
    );
  }
}

export default Relay.createContainer(CommentsList, {
  // initialVariables: {
  //   replyFormExpanded: false,
  //   expanded: false
  // },
  fragments: {
    commenting: () => Relay.QL`
      fragment on Commenting {
        count,
        comments(first: 50) {
          edges {
            node {
              id,
              ${CommentItem.getFragment('comment')},
            }
          }
        }
        ${CommentItem.getFragment('commenting')},
        ${CommentCreate.getFragment('commenting')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${CommentItem.getFragment('viewer')},
        ${CommentCreate.getFragment('viewer')},
      }
    `,
  },
});
