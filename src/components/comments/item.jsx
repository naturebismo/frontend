import React from 'react';
import Relay from 'react-relay';
import { Media } from "react-bootstrap";

import LikeDislikeButtons from '../likes/buttons';
import CommentCreate from '../comments/add';
import CommentsReplies from './replies';


class CommentItem extends React.Component {
  handleShowReplies = (e) => {
    e.preventDefault();
    this.props.relay.setVariables({expanded: true});
  }

  render() {
    var comment = this.props.comment;

    var replies;
    if (this.props.relay.variables.expanded) {
      replies = (<CommentsReplies viewer={this.props.viewer} parent={this.props.comment} />);
    }

    return (
      <Media>
        <Media.Left>
          <img width={64} height={64} src="/assets/thumbnail.png" alt="Image"/>
        </Media.Left>
        <Media.Body>
          <Media.Heading><a href="#">{ comment.revisionCreated.author.username }</a></Media.Heading>
          <p>{ comment.body }</p>
          <LikeDislikeButtons /> <a href="#" onClick={this.handleShowReplies}>{comment.numComments} replies</a>
          <CommentCreate viewer={this.props.viewer} parent={this.props.comment} />
          {replies}
        </Media.Body>
      </Media>
    );
  }
}

export default Relay.createContainer(CommentItem, {
  initialVariables: {
    expanded: false
  },
  fragments: {
    comment: (variables) => Relay.QL`
      fragment on Comment {
        id,
        body,
        numComments,
        revisionCreated {
          author {
            username
          },
          createdAt
        },
        ${CommentsReplies.getFragment('parent').if(variables.expanded)},
      }
    `,
    viewer: (variables) => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${CommentsReplies.getFragment('viewer').if(variables.expanded)},
        ${CommentCreate.getFragment('viewer')}
      }
    `,
  },
});
