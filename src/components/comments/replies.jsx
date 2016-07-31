import React from 'react';
import Relay from 'react-relay';
import { Media } from "react-bootstrap";

import CommentItem from './item';
import CommentCreate from '../comments/add';

class CommentsReplies extends React.Component {
  handleHideReplyForm = () => {
    this.props.relay.setVariables({replyFormExpanded: false});
  }

  handleReplyFocus = (input) => {
    input.focus();
  }

  render() {
    var comments = this.props.comments;
    var viewer = this.props.viewer;

    var repliesCount;
    if(comments.count >= 1) {
      if(typeof this.props.handleToggleReplies === 'function'){
        repliesCount = (<button className="list-group-item list-group-item-info comments-toggle-replies" onClick={this.props.handleToggleReplies}>{comments.count} respostas</button>);
      } else {
        repliesCount = (<div className="list-group-item list-group-item-info comments-toggle-replies">{comments.count} respostas</div>);
      }
    }

    var comments_rendered;
    if(this.props.relay.variables.expanded) {
      comments_rendered = comments.edges.map(function(edge, i){
        var comment = edge.node;
        return (
          <CommentItem key={comment.id} viewer={viewer} comment={comment} />
        );
      });
    }

    var replyForm;
    if(this.props.relay.variables.replyFormExpanded) {
      replyForm = (<CommentCreate viewer={this.props.viewer} parent={this.props.parent}
        onShown={this.props.handleReplyFocus}
        onSuccess={this.handleHideReplyForm} />);
    }

    return (
      <div className="list-group comments-list">
        {replyForm}
        {repliesCount}
        {comments_rendered}
      </div>
    );
  }
}

export default Relay.createContainer(CommentsReplies, {
  initialVariables: {
    replyFormExpanded: false,
    expanded: false
  },
  fragments: {
    parent: () => Relay.QL`
      fragment on Node {
        id
         ${CommentCreate.getFragment('parent')},
      }
    `,
    comments: () => Relay.QL`
      fragment on CommentConnection {
        count,
        edges {
          node {
            id,
            ${CommentItem.getFragment('comment')},
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
        ${CommentCreate.getFragment('viewer')},
      }
    `,
  },
});
